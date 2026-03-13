import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';
export declare class StaffDashboardService {
    private memberModel;
    private staffModel;
    private activityLogModel;
    constructor(memberModel: Model<Member>, staffModel: Model<Staff>, activityLogModel: Model<ActivityLog>);
    getStaffStats(): Promise<{
        totalMembers: number;
        totalBooks: number;
        booksIssued: number;
        booksReturned: number;
        overdueBooks: number;
        pendingRequests: number;
    }>;
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
    getBooksAddedToday(): Promise<any[]>;
    getRecentActivities(): Promise<(import("mongoose").Document<unknown, {}, ActivityLog, {}, {}> & ActivityLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getRackDistribution(): Promise<any[]>;
    createBook(bookData: any): Promise<{
        message: string;
        data: any;
    }>;
    getMyActivityLogs(staffId: string): Promise<(import("mongoose").Document<unknown, {}, ActivityLog, {}, {}> & ActivityLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMyProfile(staffId: string): Promise<import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyContribution(staffId: string): Promise<{
        totalActivities: number;
        booksAdded: number;
        booksIssued: number;
        booksReturned: number;
    }>;
    getBooksByCategory(): Promise<any[]>;
    getRackUtilization(): Promise<any[]>;
    getBooksStatusDistribution(): Promise<{
        available: number;
        issued: number;
        overdue: number;
        damaged: number;
    }>;
}
