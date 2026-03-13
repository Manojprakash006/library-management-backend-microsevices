import { StaffDashboardService } from '../service/staff-dashboard.service';
export declare class StaffDashboardController {
    private readonly staffDashboardService;
    constructor(staffDashboardService: StaffDashboardService);
    getStaffStats(): Promise<{
        message: string;
        data: {
            totalMembers: number;
            totalBooks: number;
            booksIssued: number;
            booksReturned: number;
            overdueBooks: number;
            pendingRequests: number;
        };
    }>;
    getRecentIssues(): Promise<{
        message: string;
        data: any[];
    }>;
    getOverdueBooks(): Promise<{
        message: string;
        data: any[];
    }>;
    getPendingRequests(): Promise<{
        message: string;
        data: any[];
    }>;
    getStaffStatCards(): Promise<{
        message: string;
        data: {
            totalBooks: number;
            totalMembers: number;
            booksIssuedToday: number;
            booksReturnedToday: number;
            overdueBooks: number;
            pendingRequests: number;
        };
    }>;
    getBooksAddedToday(): Promise<{
        message: string;
        data: any[];
    }>;
    getRecentActivities(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../../activity-logs/entities/activity-log.entity").ActivityLog, {}, {}> & import("../../activity-logs/entities/activity-log.entity").ActivityLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getRackDistribution(): Promise<{
        message: string;
        data: any[];
    }>;
    createBook(bookData: any): Promise<{
        message: string;
        data: {
            message: string;
            data: any;
        };
    }>;
    getMyActivityLogs(req: any): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../../activity-logs/entities/activity-log.entity").ActivityLog, {}, {}> & import("../../activity-logs/entities/activity-log.entity").ActivityLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getMyProfile(req: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../staff/entities/staff.entity").Staff, {}, {}> & import("../../staff/entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getMyContribution(req: any): Promise<{
        message: string;
        data: {
            totalActivities: number;
            booksAdded: number;
            booksIssued: number;
            booksReturned: number;
        };
    }>;
    getBooksByCategory(): Promise<{
        message: string;
        data: any[];
    }>;
    getRackUtilization(): Promise<{
        message: string;
        data: any[];
    }>;
    getBooksStatusDistribution(): Promise<{
        message: string;
        data: {
            available: number;
            issued: number;
            overdue: number;
            damaged: number;
        };
    }>;
}
