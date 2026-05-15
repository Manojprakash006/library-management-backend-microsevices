import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BookRequest, BookRequestDocument, RequestStatus } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
    private readonly configService: ConfigService,
  ) { }

  private getMembersServiceUrl(): string {
    return this.configService.get('MEMBERS_SERVICE_URL') || 'http://localhost:3012';
  }

  private getIssuesServiceUrl(): string {
    return this.configService.get('ISSUES_SERVICE_URL') || 'http://localhost:3013';
  }

  private getBooksServiceUrl(): string {
    return this.configService.get('BOOKS_SERVICE_URL') || 'http://localhost:3001';
  }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = this.getMembersServiceUrl();
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
      const membersServiceUrl = this.getMembersServiceUrl();
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
      const membersServiceUrl = this.getMembersServiceUrl();
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
    // 1. Check if member already has a pending request for this book

    // 1. Check if member already has a pending request for this book
    const existingPendingRequest = await this.bookRequestModel.findOne({
      memberId: new Types.ObjectId(createDto.memberId),
      bookId: new Types.ObjectId(createDto.bookId),
      status: RequestStatus.PENDING
    }).exec();

    if (existingPendingRequest) {
      throw new ConflictException('You have already requested this book and it is pending approval.');
    }

    // Fetch member borrowing statistics
    const { currentlyBorrowed, totalHistory, activeBookIds } = await this.getMemberBorrowingDetails(createDto.memberId);

    // 2. Check if member already has this book actively borrowed
    const alreadyBorrowed = activeBookIds.some(id => id.toString() === createDto.bookId.toString());
    if (alreadyBorrowed) {
      throw new ConflictException('You have already borrowed this book. Please return it before requesting again.');
    }

    const bookRequest = new this.bookRequestModel({
      ...createDto,
      bookId: new Types.ObjectId(createDto.bookId),
      memberId: new Types.ObjectId(createDto.memberId),
      requestDate: createDto.requestDate || new Date(),
      status: RequestStatus.PENDING,
      currentlyBorrowed,
      totalHistory,
    });

    const savedRequest = await bookRequest.save();

    // Notify admins about the new request
    await this.notifyAdmins(
      'NEW_BOOK_REQUEST',
      'New Book Request Received',
      `A new request has been placed for Book ID: ${createDto.bookId} by Member ID: ${createDto.memberId}.`,
      createDto.bookId // Pass bookId as issueId for enrichment
    );

    // Emit real-time event
    await this.redisEmitter.emit('REQUEST_CREATED', savedRequest);
    await this.redisEmitter.emit('REQUESTS_UPDATED', { type: 'create', request: savedRequest });
    await this.invalidatePendingCountCache();

    return savedRequest;
  }

  private async getMemberBorrowingDetails(memberId: string): Promise<{ currentlyBorrowed: number; totalHistory: number; activeBookIds: Types.ObjectId[]; booklistBorrowed: string[] }> {
    try {
      const issuesServiceUrl = this.getIssuesServiceUrl();

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
      const issuesServiceUrl = this.getIssuesServiceUrl();
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
          const bookServiceURL = this.getBooksServiceUrl();
          const bookResponse = await firstValueFrom(
            this.httpService.get(`${bookServiceURL}/books/${bookId}`)
          );

          const book = bookResponse.data?.data;
          return {
            ...req,
            bookId: book,
          };

        } catch (error) {
          console.log("❌ BOOK FETCH FAILED:", error.message);

          return {
            ...req,
            bookId: null,
          };
        }
      })
    );


    return enriched;
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

  async approve(id: string, adminId?: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (!/pending/i.test(request.status)) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    request.status = RequestStatus.APPROVED;
    request.processedDate = new Date();
    const savedRequest = await request.save();

    const membersServiceUrl = this.getMembersServiceUrl();

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

    if (adminId) {
      this.logActivity(adminId, 'APPROVE', id, { bookId: request.bookId, memberId: request.memberId });
    }

    // Fetch book details for notification
    let bookTitle = 'Book';
    try {
      const bookServiceURL = this.getBooksServiceUrl();
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
      const bookServiceURL = this.getBooksServiceUrl();
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
