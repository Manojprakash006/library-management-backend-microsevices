import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Book, BookDocument } from '../../books/entities/book.entity';

interface CountResponse {
  count: number;
}

interface DailyIssueReturnReport {
  date: string;
  booksIssued: number;
  booksReturned: number;
}

interface OverdueReport {
  overdueStatus: number;
  booksOverdue: number;
}

interface RackInventoryReport {
  rackNumber: string;
  location: string;
  total: number;
  available: number;
  issued: number;
  capacityPercentage: number;
}

interface MemberActivityReport {
  activeMembers: number;
  inactiveMembers: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getDailyIssueReturnReport(): Promise<DailyIssueReturnReport> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split('T')[0];

    const [booksIssued, booksReturned] = await Promise.all([
      this.getTodayIssuesCount(),
      this.getTodayReturnsCount(),
    ]);

    return {
      date: dateStr,
      booksIssued,
      booksReturned,
    };
  }

  async getOverdueReport(): Promise<OverdueReport> {
    const booksOverdue = await this.getOverdueBooksCount();
    return {
      overdueStatus: booksOverdue > 0 ? 1 : 0,
      booksOverdue,
    };
  }

  async getRackInventoryReport(): Promise<RackInventoryReport[]> {
    const books = await this.bookModel.find().exec();
    const rackMap: Record<string, RackInventoryReport> = {};

    // Get issued book counts per book
    const bookIssueCounts = await this.getAllBookIssueCounts();

    for (const book of books) {
      const rackNumber = book.rackNumber;

      if (!rackMap[rackNumber]) {
        rackMap[rackNumber] = {
          rackNumber: rackNumber,
          location: 'Main Hall',
          total: 0,
          available: 0,
          issued: 0,
          capacityPercentage: 0,
        };
      }

      const quantity = book.quantity || 0;
      const bookId = book._id.toString();
      const issuedCount = bookIssueCounts[bookId] || 0;
      const availableCount = Math.max(0, quantity - issuedCount);

      rackMap[rackNumber].total += quantity;
      rackMap[rackNumber].available += availableCount;
      rackMap[rackNumber].issued += issuedCount;
    }

    for (const rackNumber in rackMap) {
      const rack = rackMap[rackNumber];
      const capacity = 50;
      rack.capacityPercentage = Math.round((rack.total / capacity) * 100);
    }

    return Object.values(rackMap);
  }

  async getRackInventoryById(rackNumber: string): Promise<RackInventoryReport> {
    const books = await this.bookModel.find({ rackNumber }).exec();

    if (books.length === 0) {
      throw new NotFoundException('Rack not found or has no books');
    }

    let total = 0;
    let available = 0;
    let issued = 0;

    for (const book of books) {
      const quantity = book.quantity || 0;
      const bookId = book._id.toString();
      const issuedCount = await this.getBookIssueCount(bookId);
      const availableCount = Math.max(0, quantity - issuedCount);

      total += quantity;
      available += availableCount;
      issued += issuedCount;
    }

    const capacity = 50;
    const capacityPercentage = Math.round((total / capacity) * 100);

    return {
      rackNumber: rackNumber,
      location: 'Main Hall',
      total: total,
      available: available,
      issued: issued,
      capacityPercentage: capacityPercentage,
    };
  }

  async getMemberActivityReport(): Promise<MemberActivityReport> {
    const [activeMembers, inactiveMembers] = await Promise.all([
      this.getActiveMembersCount(),
      this.getInactiveMembersCount(),
    ]);

    return {
      activeMembers,
      inactiveMembers,
    };
  }

  async getAllReports(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [dailyIssueReturn, overdue, rackInventory, memberActivity] = await Promise.all([
      this.getDailyIssueReturnReport(),
      this.getOverdueReport(),
      this.getRackInventoryReport(),
      this.getMemberActivityReport(),
    ]);

    return {
      dailyIssueReturn,
      overdue,
      rackInventory,
      memberActivity,
    };
  }

  // Private helper methods for HTTP calls
  private async getTodayIssuesCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const today = new Date().toISOString().split('T')[0];
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count?date=${today}`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get today issues count: ${error.message}`);
      return 0;
    }
  }

  private async getTodayReturnsCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const today = new Date().toISOString().split('T')[0];
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/returns/count?date=${today}`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get today returns count: ${error.message}`);
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
      this.logger.error(`Failed to get overdue books count: ${error.message}`);
      return 0;
    }
  }

  private async getBookIssueCount(bookId: string): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count/book/${bookId}`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get book issue count for ${bookId}: ${error.message}`);
      return 0;
    }
  }

  private async getAllBookIssueCounts(): Promise<Record<string, number>> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response: AxiosResponse<{ issues: any[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues`)
      );
      const issues = response.data?.issues || [];
      
      const counts: Record<string, number> = {};
      for (const issue of issues) {
        if (issue.status !== 'Returned') {
          const bookId = issue.bookId?.toString() || issue.bookId;
          counts[bookId] = (counts[bookId] || 0) + 1;
        }
      }
      return counts;
    } catch (error) {
      this.logger.error(`Failed to get all book issue counts: ${error.message}`);
      return {};
    }
  }

  private async getActiveMembersCount(): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/count/active`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get active members count: ${error.message}`);
      return 0;
    }
  }

  private async getInactiveMembersCount(): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
      const response: AxiosResponse<CountResponse> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/count/inactive`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get inactive members count: ${error.message}`);
      return 0;
    }
  }
}
