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

  async getStatCards() {
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
      overdueBooks,
      totalMembers,
      newArrivals,
      pendingRequests,
      todayIssues,
    };
  }

  async getRecentBooks() {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response: AxiosResponse<{ issues: any[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/recent?limit=5`)
      );
      return response.data?.issues || [];
    } catch (error) {
      return [];
    }
  }

  async getOverdueBooks() {
    return this.bookModel.find({ status: 'overdue' }).select('-__v');
  }

  async getPendingRequests() {
    return this.bookRequestModel.find({ status: 'Pending' })
      .populate('bookId', 'title author')
      .populate('memberId', 'name email')
      .sort({ requestDate: -1 })
      .select('-__v');
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

  private async getTotalMembersCount(): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/count`)
      );
      return response.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getNewArrivalsCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.bookModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
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
