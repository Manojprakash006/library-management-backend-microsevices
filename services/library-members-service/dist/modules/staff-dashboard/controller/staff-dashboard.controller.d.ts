import { StaffDashboardService } from '../service/staff-dashboard.service';
import { CreateBookDto } from '../dto/create-book.dto';
export declare class StaffDashboardController {
    private readonly staffDashboardService;
    constructor(staffDashboardService: StaffDashboardService);
    getStaffStats(req: any): Promise<{
        message: string;
        data: {
            totalBooks: number;
            availableBooks: number;
            issuedBooks: number;
            todayBookAdded: number;
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
    getBooksAddedToday(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    getRackDistribution(req: any): Promise<{
        message: string;
        data: any[];
    }>;
    createBook(bookData: CreateBookDto, req: any): Promise<{
        message: string;
        data: {
            message: string;
            data: any;
        };
    }>;
    getMyActivitySummary(req: any): Promise<{
        message: string;
        data: {
            totalActivitiesBooksAdded: number;
            todaysActivitiesBooksAdded: number;
            recentActivities: {
                action: any;
                date: any;
                description: any;
                referenceId: any;
            }[];
        };
    }>;
    getMyProfile(req: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../staff/entities/staff.entity").Staff, {}, {}> & import("../../staff/entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
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
    getTodaysVisitors(): Promise<{
        message: string;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../../library-visits/entities/library-visit.entity").LibraryVisit, {}, {}> & import("../../library-visits/entities/library-visit.entity").LibraryVisit & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getTodaysIssues(req: any): Promise<{
        message: string;
        count: number;
        data: any[];
    }>;
}
