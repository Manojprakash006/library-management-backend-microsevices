import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Member } from '../../members/entities/member.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { LibraryVisit } from '../../library-visits/entities/library-visit.entity';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
export declare class StaffDashboardService {
    private memberModel;
    private staffModel;
    private libraryVisitModel;
    private readonly httpService;
    private readonly activityLogService;
    private readonly logger;
    constructor(memberModel: Model<Member>, staffModel: Model<Staff>, libraryVisitModel: Model<LibraryVisit>, httpService: HttpService, activityLogService: ActivityLogService);
    getStaffStats(authHeader?: string): Promise<{
        totalBooks: number;
        availableBooks: number;
        issuedBooks: number;
        todayBookAdded: number;
    }>;
    private getBooksAddedTodayCount;
    getRecentIssues(): Promise<any[]>;
    getOverdueBooks(): Promise<any[]>;
    getPendingRequests(): Promise<any[]>;
    getStatCards(): Promise<{
        totalBooks: number;
        totalMembers: number;
        booksIssuedToday: number;
        booksReturnedToday: number;
        overdueBooks: number;
        pendingRequests: number;
    }>;
    getBooksAddedToday(authHeader?: string): Promise<any[]>;
    getRecentActivities(): Promise<any[]>;
    getRackDistribution(authHeader?: string): Promise<any[]>;
    createBook(bookData: any, staffId: string, authHeader?: string): Promise<{
        message: string;
        data: any;
    }>;
    getMyProfile(staffId: string): Promise<import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyContribution(staffId: string): Promise<{
        totalActivities: number;
        booksAdded: number;
        booksIssued: number;
        booksReturned: number;
    }>;
    getMyActivitySummary(staffId: string): Promise<{
        totalActivitiesBooksAdded: number;
        todaysActivitiesBooksAdded: number;
        recentActivities: {
            action: any;
            date: any;
            description: any;
            referenceId: any;
        }[];
    }>;
    getBooksByCategory(): Promise<any[]>;
    getRackUtilization(): Promise<any[]>;
    getBooksStatusDistribution(): Promise<{
        available: number;
        issued: number;
        overdue: number;
        damaged: number;
    }>;
    getTodaysVisitors(): Promise<(import("mongoose").Document<unknown, {}, LibraryVisit, {}, {}> & LibraryVisit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTodaysIssues(authHeader?: string): Promise<any[]>;
}
