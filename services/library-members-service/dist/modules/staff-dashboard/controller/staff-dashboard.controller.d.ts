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
}
