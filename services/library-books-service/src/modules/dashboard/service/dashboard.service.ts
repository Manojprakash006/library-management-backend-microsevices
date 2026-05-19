import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { BookRequest, BookRequestDocument } from '../../book-requests/entities/book-request.entity';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
import { Logger } from '@nestjs/common';

interface CountResponse {
  count: number;
}

interface RecentIssue {
  _id: string;
  bookId: string;
  memberId: string;
  issueType: string;
  numberOfDays: number;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  daysOverdue: number;
  fine: number;
  finePerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedRecentBook {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
  };
  member: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  issueType: string;
  numberOfDays: number;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  daysOverdue: number;
  fine: number;
  finePerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
  ) { }

  async getDashboardStats() {
    const [
      totalBooks,
      totalBooksResult,
      totalDamagedResult,
      totalLostResult,
      issuedBooks,
      pendingRequests,
      overdueBooks,
      totalMembers,
      newArrivals,
      todayIssues
    ] = await Promise.all([
      this.bookModel.countDocuments(),
      this.bookModel.aggregate([{ $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }]),
      this.bookModel.aggregate([{ $group: { _id: null, totalDamaged: { $sum: '$damagedQuantity' } } }]),
      this.bookModel.aggregate([{ $group: { _id: null, totalLost: { $sum: '$lostQuantity' } } }]),
      this.getActiveIssuesCount(),
      this.bookRequestModel.countDocuments({ status: { $regex: /pending/i } }),
      this.getOverdueBooksCount(),
      this.getTotalMembersCount(),
      this.getNewArrivalsCount(),
      this.getTodayIssuesCount(),
    ]);

    const totalQuantity = totalBooksResult.length > 0 ? totalBooksResult[0].totalQuantity : 0;
    const damagedBooks = totalDamagedResult.length > 0 ? totalDamagedResult[0].totalDamaged : 0;
    const lostBooks = totalLostResult.length > 0 ? totalLostResult[0].totalLost : 0;
    const availableQuantity = Math.max(0, totalQuantity - issuedBooks);

    return {
      totalBooks,
      totalQuantity,
      availableBooks: availableQuantity,
      availableQuantity,
      issuedBooks,
      damagedBooks,
      lostBooks,
      totalMembers,
      activeIssues: issuedBooks,
      overdueBooks,
      pendingRequests,
      newArrivals,
      todayIssues,
    };
  }

  async getInventorySummary() {
    const booksByCategory = await this.bookModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    return {
      totalBooks: await this.bookModel.countDocuments(),
      booksByCategory,
    };
  }

  async getPopularBooks() {
    return this.bookModel.find().sort({ borrowCount: -1 }).limit(10).select('-__v');
  }

  async getStatCards(authHeader?: string) {
    const cacheKey = 'dashboard:stat_cards_v2';
    try {
      const cached = await this.redisEmitter.client.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      this.logger.error(`Redis cache error: ${e.message}`);
    }

    const [
      totalBooks,
      totalBooksResult,
      totalDamagedResult,
      totalLostResult,
      activeIssues,
      pendingRequests,
      overdueBooks,
      totalMembers,
      newArrivals,
      todayIssues
    ] = await Promise.all([
      this.bookModel.countDocuments().exec(),
      this.bookModel.aggregate([{ $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }]).exec(),
      this.bookModel.aggregate([{ $group: { _id: null, totalDamaged: { $sum: '$damagedQuantity' } } }]).exec(),
      this.bookModel.aggregate([{ $group: { _id: null, totalLost: { $sum: '$lostQuantity' } } }]).exec(),
      this.getActiveIssuesCount(),
      this.getPendingRequestsCount(),
      this.getOverdueBooksCount(),
      this.getTotalMembersCount(authHeader),
      this.getNewArrivalsCount(),
      this.getTodayIssuesCount(),
    ]);

    const totalQuantity = totalBooksResult.length > 0 ? totalBooksResult[0].totalQuantity : 0;
    const damagedBooks = totalDamagedResult.length > 0 ? totalDamagedResult[0].totalDamaged : 0;
    const lostBooks = totalLostResult.length > 0 ? totalLostResult[0].totalLost : 0;
    const issuedBooks = activeIssues;
    const availableQuantity = Math.max(0, totalQuantity - issuedBooks);

    const stats = {
      totalBooks,
      totalQuantity,
      availableBooks: availableQuantity,
      availableQuantity,
      issuedBooks,
      damagedBooks,
      lostBooks,
      overdueBooks,
      totalMembers,
      newArrivals,
      pendingRequests,
      todayIssues,
    };

    try {
      // Cache for 1 second to allow instant updates while preventing accidental DB hammering
      await this.redisEmitter.client.set(cacheKey, JSON.stringify(stats), 'EX', 1);
    } catch (e) {
      this.logger.error(`Redis cache set error: ${e.message}`);
    }

    return stats;
  }

  async getBooksAddedTodayList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const books = await this.bookModel.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ createdAt: -1 }).lean();

    return books;
  }

  async getBooksAddedToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.bookModel.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return count;
  }

  async getRecentBooks(authHeader?: string): Promise<PopulatedRecentBook[]> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-api-gateway:3000/library/issues';
      const response: AxiosResponse<{ issues: RecentIssue[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/recent?limit=10`)
      );

      const issues = response.data?.issues || [];
      if (issues.length === 0) return [];

      return this.populateIssuesBulk(issues, authHeader);
    } catch (error) {
      this.logger.error(`Failed to get recent books: ${error.message}`);
      return [];
    }
  }

  async getOverdueBooks(authHeader?: string): Promise<PopulatedRecentBook[]> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-api-gateway:3000/library/issues';
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/overdue`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const issues = response.data?.data || [];
      if (issues.length === 0) return [];

      return this.populateIssuesBulk(issues, authHeader);
    } catch (error) {
      this.logger.error(`Failed to get overdue books: ${error.message}`);
      return [];
    }
  }

  async getPendingRequests(authHeader?: string): Promise<any[]> {
    try {
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://library-api-gateway:3000/library/requests';
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${requestsServiceUrl}/requests`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const pendingRequests = response.data?.data?.filter(req => req.status?.toLowerCase().includes('pending')) || [];
      if (pendingRequests.length === 0) return [];

      // Sort by latest first
      pendingRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

      // Limit to first 20 for dashboard performance
      const limitedRequests = pendingRequests.slice(0, 20);

      const bookIds = [...new Set(limitedRequests.map(r => r.bookId))];
      const memberIds = [...new Set(limitedRequests.map(r => r.memberId))];

      const [booksMap, membersMap] = await Promise.all([
        this.getBooksMap(bookIds),
        this.getMembersMap(memberIds, authHeader),
      ]);

      return limitedRequests.map(req => ({
        ...req,
        book: booksMap.get(req.bookId) || this.getDefaultBook(req.bookId),
        member: membersMap.get(req.memberId) || this.getDefaultMember(req.memberId),
      }));
    } catch (error) {
      this.logger.error(`Failed to get pending requests: ${error.message}`);
      return [];
    }
  }

  private async populateIssuesBulk(issues: any[], authHeader?: string): Promise<PopulatedRecentBook[]> {
    const bookIds = [...new Set(issues.map(i => i.bookId))];
    const memberIds = [...new Set(issues.map(i => i.memberId))];

    const [booksMap, membersMap] = await Promise.all([
      this.getBooksMap(bookIds),
      this.getMembersMap(memberIds, authHeader),
    ]);

    return issues.map(issue => ({
      _id: issue._id,
      book: booksMap.get(issue.bookId) || this.getDefaultBook(issue.bookId),
      member: membersMap.get(issue.memberId) || this.getDefaultMember(issue.memberId),
      issueType: issue.issueType,
      numberOfDays: issue.numberOfDays,
      issueDate: issue.issueDate,
      dueDate: issue.dueDate,
      returnDate: issue.returnDate,
      status: issue.status,
      daysOverdue: issue.daysOverdue,
      fine: issue.fine,
      finePerDay: issue.finePerDay,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    }));
  }

  private async getBooksMap(bookIds: string[]): Promise<Map<string, any>> {
    const booksMap = new Map<string, any>();
    if (bookIds.length === 0) return booksMap;

    try {
      const books = await this.bookModel.find({ _id: { $in: bookIds } })
        .select('title author isbn category rackNumber shelfNumber quantity')
        .lean();

      books.forEach(book => {
        booksMap.set(book._id.toString(), {
          _id: book._id.toString(),
          bookId: book._id.toString(),
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          rackNumber: book.rackNumber,
          shelfNumber: book.shelfNumber,
          location: `Rack ${book.rackNumber}${book.shelfNumber ? ', Shelf ' + book.shelfNumber : ''}`,
          status: book.quantity > 0 ? 'Available' : 'Not Available',
        });
      });
    } catch (error) {
      this.logger.error(`Bulk book fetch error: ${error.message}`);
    }
    return booksMap;
  }

  private async getMembersMap(memberIds: string[], authHeader?: string): Promise<Map<string, any>> {
    const membersMap = new Map<string, any>();
    if (memberIds.length === 0) return membersMap;

    // Fetch members in parallel
    await Promise.all(memberIds.map(async (id) => {
      try {
        const member = await this.fetchMemberDetails(id, authHeader);
        membersMap.set(id, member);
      } catch (err) {
        membersMap.set(id, this.getDefaultMember(id));
      }
    }));

    return membersMap;
  }

  private async fetchMemberDetails(memberId: string, authHeader?: string): Promise<any> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response: AxiosResponse<{ data: any }> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/${memberId}`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      if (response.data?.data) {
        const member = response.data.data;
        const borrowingHistory = member.borrowingHistory || [];
        const activeBooks = borrowingHistory.filter(h => h.status === 'borrowed').length;

        return {
          _id: member._id,
          memberId: member.memberId,
          name: member.name,
          email: member.email,
          phone: member.phoneNumber,
          address: member.address,
          memberSince: member.membershipDate,
          currentlyBorrowed: activeBooks,
          totalHistory: borrowingHistory.length,
          borrowingStatus: {
            currentlyBorrowed: activeBooks,
            activeBooks: activeBooks,
            totalHistory: borrowingHistory.length,
          },
        };
      }
    } catch (error) {
      this.logger.error(`Failed to fetch member ${memberId}: ${error.message}`);
    }

    return this.getDefaultMember(memberId);
  }

  private getDefaultBook(bookId: string) {
    return {
      _id: bookId,
      bookId: 'N/A',
      title: 'Unknown Book',
      author: 'Unknown',
      isbn: 'N/A',
      category: 'N/A',
      location: 'N/A',
      status: 'Unknown',
    };
  }

  private getDefaultMember(memberId: string) {
    return {
      _id: memberId,
      memberId: 'N/A',
      name: 'Unknown Member',
      email: 'N/A',
      borrowingStatus: { currentlyBorrowed: 0, activeBooks: 0, totalHistory: 0 },
    };
  }

  private async getActiveIssuesCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count`)
      );
      return response.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getPendingRequestsCount(): Promise<number> {
    try {
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://library-requests-service:3014';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${requestsServiceUrl}/requests/count/pending`)
      );
      return response.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getOverdueBooksCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/overdue/count`)
      );
      return response.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getTotalMembersCount(authHeader?: string): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/stats/total`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );
      return response.data?.data || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getNewArrivalsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.bookModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
  }

  private async getTodayIssuesCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const today = new Date().toISOString().split('T')[0];
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count?date=${today}`)
      );
      return response.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }
}
