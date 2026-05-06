import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Member } from '../../members/entities/member.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { LibraryVisit } from '../../library-visits/entities/library-visit.entity';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';

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
    @InjectModel(LibraryVisit.name) private libraryVisitModel: Model<LibraryVisit>,
    private readonly httpService: HttpService,
    private readonly activityLogService: ActivityLogService,
  ) { }

  private async getBooksAddedTodayCount(authHeader?: string): Promise<number> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

      const response: AxiosResponse<{ data: number }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/dashboard/books-added-today`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      return response.data?.data || 0;
    } catch (error) {
      this.logger.error(`Failed to fetch today's book count: ${error.message}`);
      return 0;
    }
  }

  async getStaffStats(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Fetching stats from books service: ${booksServiceUrl}/dashboard/stat-cards`);

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
      
      return {
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
        todayBookAdded: 0,
      };
    }
  }
  
  async getBooksAddedTodayList(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/dashboard/books-added-today/list`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch today's books list: ${error.message}`);
      return [];
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

  async getBooksAddedToday(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.logger.log(`Fetching books added today`);

      // Get all books from books service
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const books = response.data?.data || [];

      // Filter books created today
      const todayBooks = books.filter((book: any) => {
        const createdAt = new Date(book.createdAt);
        return createdAt >= today;
      });

      this.logger.log(`Found ${todayBooks.length} books added today`);

      return todayBooks;
    } catch (error) {
      this.logger.error(`Failed to fetch books added today: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getRecentActivities() {
    return [];
  }

  async getRackDistribution(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

      this.logger.log(`Fetching rack distribution from: ${booksServiceUrl}/racks`);

      const response: AxiosResponse<{ data: any[]; count: number }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/racks`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const racks = response.data?.data || [];
      this.logger.log(`Found ${racks.length} racks`);

      return racks;
    } catch (error) {
      this.logger.error(`Failed to fetch rack distribution: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createBook(bookData: any, staffId: string, authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Creating book via books service: ${booksServiceUrl}/books`);

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(`${booksServiceUrl}/books`, bookData, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const createdBook = response.data?.data || response.data;
      this.logger.log(`Book created successfully: ${JSON.stringify(response.data)}`);

      if (staffId) {
        await this.activityLogService.logAction({
          adminId: staffId,
          action: 'BOOKSADDED',   
          entityType: 'BOOK',
          entityId: createdBook._id || createdBook.id || 'unknown',
          details: {
            title: createdBook.title,
            message: `Added new book: ${createdBook.title || bookData.title} (ID: ${createdBook.bookId || createdBook.id || 'unknown'})`,
            referenceId: createdBook.bookId || createdBook.id || createdBook._id
          }
        });
      }

      return {
        message: 'Book created successfully',
        data: createdBook,
      };
    } catch (error) {
      this.logger.error(`Failed to create book: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(`Error details: ${JSON.stringify((error as any).response?.data || error)}`);
      throw error;
    }
  }

  async getMyProfile(staffId: string) {
    const profile: any = await this.staffModel.findById(staffId).select('-password -__v').lean();
    if (!profile) return null;

    const contributionFilter = {
      adminId: staffId,
      action: { $nin: ['STAFF_LOGIN', 'STAFF_LOGOUT', 'ADMIN_LOGIN'] }
    };
    const totalActivities = await this.activityLogService.getLogs(1, 1, contributionFilter);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysActivities = await this.activityLogService.getLogs(1, 1, {
      ...contributionFilter,
      createdAt: { $gte: today }
    });

    const lastActivity = await this.activityLogService.getLogs(1, 1, { adminId: staffId });

    return {
      ...profile,
      department: profile.department || 'General',
      qualification: profile.qualification || 'N/A',
      address: profile.address || 'N/A',
      emergencyContact: profile.emergencyContact || 'N/A',
      joinDate: profile.createdAt,
      totalActivities: totalActivities.count || 0,
      todaysActivities: todaysActivities.count || 0,
      lastActive: lastActivity.data?.length > 0 ? (lastActivity.data[0] as any).createdAt : profile.updatedAt,
      profileImage: profile.profileImage || "",
    };
  }

  async getMyContribution(staffId: string) {
    // Exclude logins and logouts since those are not 'contributions' to the system
    const contributionFilter = {
      adminId: staffId,
      action: { $nin: ['STAFF_LOGIN', 'STAFF_LOGOUT', 'ADMIN_LOGIN'] }
    };

    const totalActivities = await this.activityLogService.getLogs(1, 1, contributionFilter);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysActivities = await this.activityLogService.getLogs(1, 1, {
      ...contributionFilter,
      createdAt: { $gte: today }
    });

    return {
      totalActivities: totalActivities.count || 0,
      todaysActivities: todaysActivities.count || 0,
    };
  }

  async getMyActivitySummary(staffId: string) {
    const totalBooksAdded = await this.activityLogService.getLogs(1, 1, { adminId: staffId, action: 'BOOKSADDED' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysBooksAdded = await this.activityLogService.getLogs(1, 1, {
      adminId: staffId,
      action: 'BOOKSADDED',
      createdAt: { $gte: today }
    });

    const lastActivityQuery = await this.activityLogService.getLogs(1, 1000, {
      adminId: staffId,
      action: { $in: ['BOOKSADDED', 'STAFF_LOGIN', 'STAFF_LOGOUT'] }
    });

    const recentActivities = lastActivityQuery.data.map((log: any) => {
      let actionName = log.action;
      if (log.action === 'BOOKSADDED') actionName = 'ADD BOOK';
      else if (log.action === 'STAFF_LOGIN') actionName = 'LOGIN';
      else if (log.action === 'STAFF_LOGOUT') actionName = 'LOGOUT';

      return {
        action: actionName,
        date: log.createdAt,
        description: log.details?.message || (actionName === 'LOGIN' ? 'Staff logged in' : actionName === 'LOGOUT' ? 'Staff logged out' : ''),
        referenceId: log.entityName || log.details?.referenceId || log.entityId
      };
    });

    return {
      totalActivitiesBooksAdded: totalBooksAdded.count || 0,
      todaysActivitiesBooksAdded: todaysBooksAdded.count || 0,
      recentActivities: recentActivities,
    };
  }

  async getBooksByCategory(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Fetching books by category from: ${booksServiceUrl}/dashboard/inventory`);

      const response: AxiosResponse<{ data: any }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/dashboard/inventory`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const booksByCategory = response.data?.data?.booksByCategory || [];

      return booksByCategory.map((item: any) => ({
        category: item._id || 'Unknown',
        count: item.count || 0
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch books by category: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getRackUtilization(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Fetching rack utilization from: ${booksServiceUrl}/racks`);

      const response: AxiosResponse<{ data: any[]; count: number }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/racks`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const racks = response.data?.data || [];

      return racks.map((rack: any) => ({
        rackNumber: rack.rackNumber || 'Unknown',
        usedCount: rack.totalBooks || 0,
        totalBooks: rack.totalBooks || 0,
        capacity: rack.capacity || 50,
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch rack utilization: ${error.message}`);
      return [];
    }
  }

  async getBooksStatusDistribution(authHeader?: string) {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      this.logger.log(`Fetching books status distribution from: ${booksServiceUrl}/dashboard/stat-cards`);

      const statsResponse: AxiosResponse<{ data: any }> = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/dashboard/stat-cards`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const stats = statsResponse.data?.data || {};

      return {
        available: stats.availableBooks || stats.availableQuantity || 0,
        issued: stats.issuedBooks || stats.activeIssues || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch books status distribution: ${error.message}`);
      return {
        available: 0,
        issued: 0,
      };
    }
  }

  async getTodaysVisitors(authHeader?: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get explicit library visits
      const visits = await this.libraryVisitModel
        .find({
          timeIn: { $gte: today },
        })
        .populate('memberId', 'name email memberId')
        .sort({ timeIn: -1 })
        .exec();

      // Also get today's issues to include those members as visitors
      const todaysIssues = await this.getTodaysIssues(authHeader);

      this.logger.log(`Found ${visits.length} explicit visitors and ${todaysIssues.length} issues today`);

      // Extract unique member IDs from visits
      const visitMemberIds = new Set(visits.map(v =>
        v.memberId?._id?.toString() || (v.memberId as any)?.toString()
      ));

      // Filter issues to find members who didn't have an explicit visit record
      const uniqueIssueMembers = new Map();
      todaysIssues.forEach(issue => {
        const memberIdStr = issue.memberId?.toString();
        if (memberIdStr && !visitMemberIds.has(memberIdStr)) {
          // Keep the earliest issue as the "visit" time
          if (!uniqueIssueMembers.has(memberIdStr) || new Date(issue.issueDate) < new Date(uniqueIssueMembers.get(memberIdStr).issueDate)) {
            uniqueIssueMembers.set(memberIdStr, issue);
          }
        }
      });

      if (uniqueIssueMembers.size > 0) {
        const additionalMemberIds = Array.from(uniqueIssueMembers.keys());
        const additionalMembers = await this.memberModel.find({
          _id: { $in: additionalMemberIds }
        }).select('name email memberId').lean();

        const virtualVisits = additionalMembers.map(member => {
          const issue = uniqueIssueMembers.get(member._id.toString());
          const isTakingHome = issue.issueType === 'Taking Home';
          const isReturned = issue.status === 'Returned';

          return {
            _id: `auto-${issue._id || issue.issueId}`,
            memberId: member,
            timeIn: issue.issueDate,
            // If taking home, they leave immediately. If reading, only set timeOut if returned.
            timeOut: isTakingHome ? issue.issueDate : (isReturned ? (issue.returnDate || new Date()) : null),
            purpose: isTakingHome ? 'issue' : 'reading',
            isAutoRecorded: true,
            // Active only if it's a reading session that hasn't been returned yet
            isActive: !isTakingHome && !isReturned,
            notes: 'Auto-included from book issue'
          };
        });

        const allVisitors = [...visits, ...virtualVisits].sort((a, b) =>
          new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime()
        );

        this.logger.log(`Total combined visitors: ${allVisitors.length}`);
        return allVisitors;
      }

      return visits;
    } catch (error) {
      this.logger.error(`Failed to get today's visitors: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getTodaysIssues(authHeader?: string) {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.logger.log(`Fetching today's issues from: ${issuesServiceUrl}`);

      // Get today's issues from issues service
      const response: AxiosResponse<{ data: any[] }> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/today`, {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        })
      );

      const issues = response.data?.data || [];
      this.logger.log(`Found ${issues.length} issues today`);

      return issues;
    } catch (error) {
      this.logger.error(`Failed to get today's issues: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }
}
