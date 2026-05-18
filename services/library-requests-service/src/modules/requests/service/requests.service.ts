import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BookRequest, BookRequestDocument, RequestStatus, RequestType } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
import { ApproveRequestDto } from '../dto/approve-request.dto';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
  ) { }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/activities/logs`, {
          adminId,
          action,
          entityType: 'REQUEST',
          entityId,
          details
        })
      );
    } catch (error) {
      this.logger.error(`Failed to log activity to member service: ${error.message}`);
    }
  }

  private async sendNotification(memberId: string, type: string, title: string, message: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications`, {
          memberId,
          type,
          title,
          message
        })
      );
    } catch (error) {
      this.logger.error(`Failed to send notification to member service: ${error.message}`);
    }
  }

  private async notifyAdmins(type: string, title: string, message: string, issueId?: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
          type,
          title,
          message,
          issueId
        })
      );
    } catch (error) {
      this.logger.error(`Failed to broadcast to admins: ${error.message}`);
    }
  }

  async create(createDto: CreateBookRequestDto): Promise<BookRequest> {

    const isBorrowRequest =
      createDto.requestType === RequestType.TAKE_HOME ||
      createDto.requestType === RequestType.READING_INSIDE_LIBRARY;

    const existingRequests = await this.bookRequestModel.find({
      memberId: new Types.ObjectId(createDto.memberId),
      bookId: new Types.ObjectId(createDto.bookId),
    }).exec();
      
      const {
        currentlyBorrowed,
        totalHistory,
        activeBookIds,
      } = await this.getMemberBorrowingDetails(createDto.memberId);
  
      const alreadyBorrowed = activeBookIds.some(
        (id) => id.toString() === createDto.bookId.toString()
      );

    if (isBorrowRequest) {

      // Already borrowed / issued
      if (alreadyBorrowed) {
        throw new ConflictException(
          'You have already borrowed this book. Please return it before requesting again.'
        );
      }

      // Pending request exists
      const hasPendingRequest = existingRequests.some(
        (req) => req.status === RequestStatus.PENDING
      );

      if (hasPendingRequest) {
        throw new ConflictException(
          'You already have a pending request for this book.'
        );
      }

      // Approved but not yet issued
      const hasApprovedRequest = existingRequests.some(
        (req) => req.status === RequestStatus.APPROVED && !req.issueId
      );

      if (hasApprovedRequest) {
        throw new ConflictException(
          'Book request already approved. Please visit the library to collect the book.'
        );
      }
    }

    if (createDto.requestType === RequestType.RENEW) {

      if (!alreadyBorrowed) {
        throw new ConflictException(
          'Renew request is only allowed for borrowed books.'
        );
      }

      const existingRenewRequest =
        await this.bookRequestModel.findOne({
          issueId: createDto.issueId,
          status: RequestStatus.RENEW_PENDING,
        });

      if (existingRenewRequest) {
        throw new ConflictException(
          'Renew request already pending'
        );
      }
    }

    const bookRequest = new this.bookRequestModel({
      ...createDto,

      bookId: new Types.ObjectId(createDto.bookId),
      memberId: new Types.ObjectId(createDto.memberId),

      requestDate: createDto.requestDate || new Date(),

      status:
        createDto.requestType === RequestType.RENEW
          ? RequestStatus.RENEW_PENDING
          : RequestStatus.PENDING,

      currentlyBorrowed,
      totalHistory,
    });

    const savedRequest = await bookRequest.save();

    await this.notifyAdmins(
      'NEW_BOOK_REQUEST',
      'New Book Request Received',
      `A new request has been placed for Book ID: ${createDto.bookId} by Member ID: ${createDto.memberId}.`,
      createDto.bookId
    );

    await this.redisEmitter.emit('REQUEST_CREATED', savedRequest);

    await this.redisEmitter.emit('REQUESTS_UPDATED', {
      type: 'create',
      request: savedRequest,
    });

    await this.invalidatePendingCountCache();

    return savedRequest;
  }

  private async getMemberBorrowingDetails(memberId: string): Promise<{ currentlyBorrowed: number; totalHistory: number; activeBookIds: Types.ObjectId[]; booklistBorrowed: string[] }> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';

      // Get all issues for this member from issues service
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}`)
      );

      const allIssues = response.data?.data || [];

      // Get active (not returned) issues - Active or Overdue status
      const activeIssues = allIssues.filter((issue: any) =>
        issue.status === 'Active' || issue.status === 'Overdue'
      );

      const currentlyBorrowed = activeIssues.length;
      const totalHistory = allIssues.length;

      // Extract active book IDs as ObjectIds
      const activeBookIds = activeIssues
        .map((issue: any) => issue.bookId)
        .filter((id: string) => id)
        .map((id: string) => new Types.ObjectId(id));

      // Create booklistBorrowed with issue details
      const booklistBorrowed = activeIssues.map((issue: any) => {
        const dueDate = issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A';
        return `${issue.bookId} - ${issue.issueType} - ${issue.status} - Due: ${dueDate}`;
      });

      return { currentlyBorrowed, totalHistory, activeBookIds, booklistBorrowed };
    } catch (error) {
      this.logger.error(`Failed to fetch member borrowing details from issues service: ${error.message}`);
      return { currentlyBorrowed: 0, totalHistory: 0, activeBookIds: [], booklistBorrowed: [] };
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string, search?: string): Promise<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      // Use case-insensitive regex for each status to be 100% sure
      query.status = { $in: statuses.map(s => new RegExp(s, 'i')) };
    }
    
    if (search) {
      // In a real app, we might need to search by book title or member name which requires aggregation or pre-enrichment
      // For now, let's search by requestId or memberId if it matches the pattern
      query.$or = [
        { requestId: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    const [requests, total] = await Promise.all([
      this.bookRequestModel.find(query).sort({ requestDate: -1 }).skip(skip).limit(limit).lean().exec(),
      this.bookRequestModel.countDocuments(query).exec(),
    ]);

    // Fetch all member stats in one go to solve N+1 problem
    const memberIds = [...new Set(requests.map(r => r.memberId.toString()))];
    let bulkStats: Record<string, any> = {};
    
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response = await firstValueFrom(
        this.httpService.post(`${issuesServiceUrl}/issues/batch-stats`, { memberIds })
      );
      bulkStats = response.data?.data || {};
    } catch (error) {
      this.logger.error(`Failed to fetch bulk member stats: ${error.message}`);
    }

    const enrichedRequests = requests.map((request) => {
      const memberId = request.memberId.toString();
      const stats = bulkStats[memberId] || { currentlyBorrowed: 0, totalHistory: 0, activeBookIds: [], booklistBorrowed: [] };

      return {
        ...request,
        currentlyBorrowed: stats.currentlyBorrowed,
        totalHistory: stats.totalHistory,
        activeBookIds: stats.activeBookIds,
        booklistBorrowed: stats.booklistBorrowed,
      };
    });

    return {
      data: enrichedRequests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getByMember(memberId: string): Promise<BookRequest[]> {

    const data = await this.bookRequestModel.find({
      memberId: new Types.ObjectId(memberId)
    }).lean();


    const enriched = await Promise.all(
      data.map(async (req) => {

        const bookId = req.bookId.toString();

        if (!bookId) {
          return { ...req, bookId: null };
        }

        try {
          const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
          const bookResponse = await firstValueFrom(
            this.httpService.get(`${bookServiceURL}/books/${bookId}`)
          );

          const book = bookResponse.data?.data;
          return {
            ...req,
            bookId: book,
          };

        } catch (error) {
          console.log("BOOK FETCH FAILED:", error.message);

          return {
            ...req,
            bookId: null,
          };
        }
      })
    );


    return enriched;
  }

  async linkIssue(body: {
    memberId: string;
    bookId: string;
    issueId: string;
  }) {

    const request = await this.bookRequestModel.findOne({
      memberId: new Types.ObjectId(body.memberId),
      bookId: new Types.ObjectId(body.bookId),
      status: RequestStatus.APPROVED,
    }).sort({ createdAt: -1 });

    if (!request) {
      return null;
    }

    request.issueId = body.issueId;

    return await request.save();
  }

  async findOne(id: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }
    return request;
  }

  async update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (!/pending/i.test(request.status)) {
      throw new BadRequestException('Only pending requests can be updated');
    }

    Object.assign(request, updateDto);
    return request.save();
  }

  async cancel(id: string, memberId: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.memberId.toString() !== memberId) {
      throw new BadRequestException('Not authorized to cancel this request');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    request.status = RequestStatus.CANCELLED;
    request.processedDate = new Date();
    await this.invalidatePendingCountCache();
    return request.save();
  }

  async approve(id: string, adminId?: string, approveDto?: ApproveRequestDto): Promise<BookRequest> {

    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (!/pending/i.test(request.status)) {
      throw new BadRequestException('Only pending requests can be approved');
    }
    if (request.requestType === 'RENEW') {

      const renewDays = approveDto?.renewDays ?? request.renewDays ?? 7;

      const issueServiceURL =
        process.env.ISSUES_SERVICE_URL ||
        'http://library-issues-service:3013';

      try {
        await firstValueFrom(
          this.httpService.put(
            `${issueServiceURL}/issues/renew/${request.issueId}`, { renewDays}
          )
        );
      } catch (error) {
        console.log('RENEW FAILED :', error.response?.data || error.message);
        throw new BadRequestException('Renew Failed');
      }


      request.renewDays = renewDays;
    }

    request.status = RequestStatus.APPROVED;
    request.processedDate = new Date();
    const savedRequest = await request.save();

    if (request.requestType !== 'RENEW') {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || "http://library-members-service:3012";

      try {
        await firstValueFrom(
          this.httpService.post(
            `${membersServiceUrl}/members/${request.memberId}/borrow`,
            {
              bookId: request.bookId.toString(),
              issueId: request._id.toString(),
              borrowedAt: new Date(),
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              status: 'borrowed',
            }
          )
        );
      } catch (error) {
        this.logger.error(`Failed to update borrowing history: ${error.message}`);
      }
    }
    if (adminId) {
      this.logActivity(adminId, 'APPROVE', id, { bookId: request.bookId, memberId: request.memberId });
    }

    // Fetch book details for notification
    let bookTitle = 'Book';
    try {
      const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
      const bookRes = await firstValueFrom(this.httpService.get(`${bookServiceURL}/books/${request.bookId}`));
      bookTitle = bookRes.data?.data?.title || 'Book';
    } catch (e) {
      this.logger.error(`Failed to fetch book title for approval notification: ${e.message}`);
    }

    // Send notification to member (fire and forget)
    this.sendNotification(
      request.memberId.toString(),
      'REQUEST_APPROVED',
      'Book Request Approved',
      `Dear member, your request for "${bookTitle}" (Book ID: ${request.bookId}) has been approved. You can now collect the book from the library.`
    );

    // Emit real-time event
    await this.redisEmitter.emit('REQUEST_APPROVED', savedRequest);
    await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'approve', request: savedRequest });
    await this.invalidatePendingCountCache();

    return savedRequest;
  }

  async markRequestAsReturned(issueId: string) {
    console.log('SERVICE ISSUE ID:', issueId);

    const request = await this.bookRequestModel.findOne({
      issueId,
      status: RequestStatus.APPROVED,
    });
    console.log('FOUND REQUEST :', request);

    if (!request) {
      return null;
    }

    request.status = RequestStatus.RETURNED;
    const save =  await request.save();
    console.log('UPDATED SYATUS:', request.status);
    return save;
  }

  async reject(id: string, adminId?: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (!/pending/i.test(request.status)) {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    request.status = RequestStatus.REJECTED;
    request.processedDate = new Date();
    const savedRequest = await request.save();

    if (adminId) {
      this.logActivity(adminId, 'REJECT', id, { bookId: request.bookId, memberId: request.memberId });
    }

    // Fetch book details for notification
    let bookTitle = 'Book';
    try {
      const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";
      const bookRes = await firstValueFrom(this.httpService.get(`${bookServiceURL}/books/${request.bookId}`));
      bookTitle = bookRes.data?.data?.title || 'Book';
    } catch (e) {
      this.logger.error(`Failed to fetch book title for rejection notification: ${e.message}`);
    }

    // Send notification to member (fire and forget)
    this.sendNotification(
      request.memberId.toString(),
      'REQUEST_REJECTED',
      'Book Request Rejected',
      `Unfortunately, your request for "${bookTitle}" (Book ID: ${request.bookId}) has been rejected. Please contact the librarian for more details.`
    );

    // Emit real-time event
    await this.redisEmitter.emit('REQUEST_REJECTED', savedRequest);
    await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'reject', request: savedRequest });
    await this.invalidatePendingCountCache();

    return savedRequest;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Book request not found');
    }
  }

  async getPendingCount(): Promise<number> {
    const cacheKey = 'requests:pending_count';
    try {
      // Try to get from Redis first
      const cachedCount = await (this.redisEmitter as any).redisClient.get(cacheKey);
      if (cachedCount !== null) {
        return parseInt(cachedCount, 10);
      }
    } catch (e) {
      this.logger.error(`Redis cache get error: ${e.message}`);
    }

    const count = await this.bookRequestModel.countDocuments({ 
      status: { $regex: /pending/i } 
    }).exec();
    
    try {
      // Cache for 5 minutes
      await (this.redisEmitter as any).redisClient.set(cacheKey, count.toString(), 'EX', 300);
    } catch (e) {
      this.logger.error(`Redis cache set error: ${e.message}`);
    }

    return count;
  }

  private async invalidatePendingCountCache() {
    try {
      await (this.redisEmitter as any).redisClient.del('requests:pending_count');
    } catch (e) {
      this.logger.error(`Redis cache invalidate error: ${e.message}`);
    }
  }
}
