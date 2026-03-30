import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Member } from '../../members/entities/member.entity';
import { Staff } from '../../staff/entities/staff.entity';

interface BooksStatsResponse {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
}

@Injectable()
export class StaffDashboardService {
  private readonly logger = new Logger(StaffDashboardService.name);

  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    private readonly httpService: HttpService,
  ) {}

  async getStaffStats(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Fetching stats from books service: ${booksServiceUrl}/dashboard/stat-cards`);

      // Get books stats from books service
      const statsResponse: AxiosResponse<{ data: BooksStatsResponse }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/dashboard/stat-cards`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      this.logger.log(`Books service response: ${JSON.stringify(statsResponse.data)}`);

      const stats: BooksStatsResponse = statsResponse.data?.data || {
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
      };

      this.logger.log(`Parsed stats: ${JSON.stringify(stats)}`);

      // Get books added today
      const todayBookAdded = await this.getBooksAddedTodayCount(authHeader);

      return {
        totalBooks: stats.totalBooks || 0,
        availableBooks: stats.availableBooks || 0,
        issuedBooks: stats.issuedBooks || 0,
        todayBookAdded: todayBookAdded,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch stats from books service: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data || error)}`);
      // Return default values if books service is unavailable
      return {
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
        todayBookAdded: 0,
      };
    }
  }

  private async getBooksAddedTodayCount(authHeader?: string): Promise<number> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all books and filter by createdAt date
      const response: AxiosResponse<{ data: any[]; count: number }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const books = response.data?.data || [];
      const todayBookAdded = books.filter((book: any) => {
        const createdAt = new Date(book.createdAt);
        return createdAt >= today;
      }).length;

      return todayBookAdded;
    } catch (error) {
      this.logger.error(`Failed to fetch books added today: ${error.message}`);
      return 0;
    }
  }

  async getRecentIssues() {
    return [];
  }

  async getOverdueBooks() {
    return [];
  }

  async getPendingRequests() {
    return [];
  }

  async getStatCards() {
    return {
      totalBooks: 0,
      totalMembers: await this.memberModel.countDocuments(),
      booksIssuedToday: 0,
      booksReturnedToday: 0,
      overdueBooks: 0,
      pendingRequests: 0,
    };
  }

  async getBooksAddedToday(staffId?: string, authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.logger.log(`Fetching books added today for staff: ${staffId}`);

      // Get all books from books service
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const books = response.data?.data || [];

      // Filter books created today by this staff member
      const todayBooks = books.filter((book: any) => {
        const createdAt = new Date(book.createdAt);
        const isToday = createdAt >= today;
        const isCreatedByThisStaff = staffId ? book.createdBy === staffId : true;
        return isToday && isCreatedByThisStaff;
      });

      this.logger.log(`Found ${todayBooks.length} books added today by staff ${staffId}`);

      return todayBooks;
    } catch (error) {
      this.logger.error(`Failed to fetch books added today: ${error.message}`);
      return [];
    }
  }

  async getRecentActivities() {
    // TODO: Implement when activity logs module is created
    return [];
  }

  async getRackDistribution() {
    return [];
  }

  async createBook(bookData: any, authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Creating book via books service: ${booksServiceUrl}/books`);

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(`${booksServiceUrl}/books`, bookData, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      this.logger.log(`Book created successfully: ${JSON.stringify(response.data)}`);
      return {
        message: 'Book created successfully',
        data: response.data?.data || response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to create book: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data || error)}`);
      throw error;
    }
  }

  async getMyActivityLogs(staffId: string) {
    // TODO: Implement when activity logs module is created
    return [];
  }

  async getMyProfile(staffId: string) {
    return this.staffModel.findById(staffId).select('-password -__v');
  }

  async getMyContribution(staffId: string) {
    // TODO: Implement when activity logs module is created
    return {
      totalActivities: 0,
      booksAdded: 0,
      booksIssued: 0,
      booksReturned: 0,
    };
  }

  async getBooksByCategory() {
    return [];
  }

  async getRackUtilization() {
    return [];
  }

  async getBooksStatusDistribution() {
    return {
      available: 0,
      issued: 0,
      overdue: 0,
      damaged: 0,
    };
  }
}
