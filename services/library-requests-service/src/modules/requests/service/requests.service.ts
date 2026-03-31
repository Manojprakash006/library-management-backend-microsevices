import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BookRequest, BookRequestDocument, RequestStatus } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
    private readonly httpService: HttpService,
  ) { }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
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

  private async notifyAdmins(type: string, title: string, message: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
          type,
          title,
          message
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
      `A new request has been placed for Book ID: ${createDto.bookId} by Member ID: ${createDto.memberId}. Please review it in the pending requests dashboard.`
    );

    return savedRequest;
  }

  private async getMemberBorrowingDetails(memberId: string): Promise<{ currentlyBorrowed: number; totalHistory: number; activeBookIds: Types.ObjectId[]; booklistBorrowed: string[] }> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';

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

  async findAll(): Promise<any[]> {
    const requests = await this.bookRequestModel.find().sort({ requestDate: -1 }).exec();

    // Enrich each request with real-time member borrowing data
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const memberStats = await this.getMemberBorrowingDetails(request.memberId.toString());
        return {
          ...request.toObject(),
          currentlyBorrowed: memberStats.currentlyBorrowed,
          totalHistory: memberStats.totalHistory,
          activeBookIds: memberStats.activeBookIds,
          booklistBorrowed: memberStats.booklistBorrowed,
        };
      })
    );

    return enrichedRequests;
  }

  async findOne(id: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }
    return request;
  }

  async findByMember(memberId: string): Promise<any[]> {
    const requests = await this.bookRequestModel.find({ memberId: new Types.ObjectId(memberId) }).sort({ requestDate: -1 }).exec();

    // Get real-time member borrowing data once
    const memberStats = await this.getMemberBorrowingDetails(memberId);

    // Enrich all requests with the same member data
    const enrichedRequests = requests.map((request) => ({
      ...request.toObject(),
      currentlyBorrowed: memberStats.currentlyBorrowed,
      totalHistory: memberStats.totalHistory,
      activeBookIds: memberStats.activeBookIds,
      booklistBorrowed: memberStats.booklistBorrowed,
    }));

    return enrichedRequests;
  }

  async update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
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
    return request.save();
  }

  async approve(id: string, adminId?: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    request.status = RequestStatus.APPROVED;
    request.processedDate = new Date();
    const savedRequest = await request.save();

    if (adminId) {
      await this.logActivity(adminId, 'APPROVE', id, { bookId: request.bookId, memberId: request.memberId });
    }

    // Send notification to member
    await this.sendNotification(
      request.memberId.toString(),
      'REQUEST_APPROVED',
      'Book Request Approved',
      `Your request for book (ID: ${request.bookId}) has been approved. You can now collect the book from the library.`
    );

    return savedRequest;
  }

  async reject(id: string, adminId?: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    request.status = RequestStatus.REJECTED;
    request.processedDate = new Date();
    const savedRequest = await request.save();

    if (adminId) {
      await this.logActivity(adminId, 'REJECT', id, { bookId: request.bookId, memberId: request.memberId });
    }

    // Send notification to member
    await this.sendNotification(
      request.memberId.toString(),
      'REQUEST_REJECTED',
      'Book Request Rejected',
      `Unfortunately, your request for book (ID: ${request.bookId}) has been rejected. Please contact the librarian for more details.`
    );

    return savedRequest;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Book request not found');
    }
  }

  async getPendingCount(): Promise<number> {
    return this.bookRequestModel.countDocuments({ status: RequestStatus.PENDING });
  }
}
