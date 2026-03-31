import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { BookRequest, BookRequestDocument } from '../../book-requests/entities/book-request.entity';

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
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getDashboardStats() {
    const totalBooks = await this.bookModel.countDocuments();
    const availableBooks = await this.bookModel.countDocuments({ status: 'available' });
    const issuedBooks = await this.bookModel.countDocuments({ status: 'issued' });
    const pendingRequests = await this.bookRequestModel.countDocuments({ status: 'Pending' });
    
    const overdueBooks = await this.getOverdueBooksCount();
    const totalMembers = await this.getTotalMembersCount();
    const newArrivals = await this.getNewArrivalsCount();
    const todayIssues = await this.getTodayIssuesCount();
    
    return {
      totalBooks,
      availableBooks,
      issuedBooks,
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
    const totalBooks = await this.bookModel.countDocuments();
    
    // Calculate available/issued from quantity and issues service
    const availableBooks = await this.bookModel.countDocuments({ quantity: { $gt: 0 } });
    const activeIssues = await this.getActiveIssuesCount();
    const issuedBooks = activeIssues;
    
    // Get pending requests from requests service instead of local DB
    const pendingRequests = await this.getPendingRequestsCount();
    
    const overdueBooks = await this.getOverdueBooksCount();
    const totalMembers = await this.getTotalMembersCount(authHeader);
    const newArrivals = await this.getNewArrivalsCount();
    const todayIssues = await this.getTodayIssuesCount();

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalMembers,
      newArrivals,
      pendingRequests,
      todayIssues,
    };
  }

  async getRecentBooks(authHeader?: string): Promise<PopulatedRecentBook[]> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response: AxiosResponse<{ issues: RecentIssue[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/recent?limit=5`)
      );

      const issues = response.data?.issues || [];
      if (issues.length === 0) return [];

      const populatedIssues = await Promise.all(
        issues.map(async (issue) => {
          const [book, member] = await Promise.all([
            this.fetchBookDetails(issue.bookId),
            this.fetchMemberDetails(issue.memberId, authHeader),
          ]);

          return {
            _id: issue._id,
            book,
            member,
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
          };
        })
      );

      return populatedIssues;
    } catch (error) {
      return [];
    }
  }

  private async fetchBookDetails(bookId: string): Promise<any> {
    try {
      const book = await this.bookModel.findById(bookId)
        .select('title author isbn category rackNumber shelfNumber quantity')
        .lean();
      if (book) {
        return {
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
        };
      }
    } catch (error) {
      // Fall through to default
    }

    return {
      _id: bookId,
      bookId: 'N/A',
      title: 'Unknown Book',
      author: 'Unknown',
      isbn: 'N/A',
      category: 'N/A',
      rackNumber: 'N/A',
      shelfNumber: 'N/A',
      location: 'N/A',
      status: 'Unknown',
    };
  }

  private async fetchMemberDetails(memberId: string, authHeader?: string): Promise<any> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
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
      // Fall through to default
    }

    return {
      _id: memberId,
      memberId: 'N/A',
      name: 'Unknown Member',
      email: 'N/A',
      phone: 'N/A',
      address: 'N/A',
      memberSince: null,
      currentlyBorrowed: 0,
      totalHistory: 0,
      borrowingStatus: {
        currentlyBorrowed: 0,
        activeBooks: 0,
        totalHistory: 0,
      },
    };
  }

  async getOverdueBooks(authHeader?: string): Promise<PopulatedRecentBook[]> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/overdue`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const issues = response.data?.data || [];
      if (issues.length === 0) return [];

      const populatedIssues = await Promise.all(
        issues.map(async (issue) => {
          const [book, member] = await Promise.all([
            this.fetchBookDetails(issue.bookId),
            this.fetchMemberDetails(issue.memberId, authHeader),
          ]);

          return {
            _id: issue._id,
            book,
            member,
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
          };
        })
      );

      return populatedIssues;
    } catch (error) {
      return [];
    }
  }

  async getPendingRequests(authHeader?: string): Promise<any[]> {
    try {
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://localhost:3014';
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${requestsServiceUrl}/requests`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );
      
      const pendingRequests = response.data?.data?.filter(req => req.status === 'Pending') || [];
      
      const populatedRequests = await Promise.all(
        pendingRequests.map(async (req) => {
          const [book, member] = await Promise.all([
            this.fetchBookDetails(req.bookId),
            this.fetchMemberDetails(req.memberId, authHeader),
          ]);
          return {
            ...req,
            book,
            member,
          };
        })
      );
      
      return populatedRequests.sort((a, b) => 
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
    } catch (error) {
      return [];
    }
  }

  private async getActiveIssuesCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
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
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://localhost:3014';
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
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
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
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
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
