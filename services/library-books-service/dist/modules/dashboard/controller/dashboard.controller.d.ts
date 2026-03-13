import { DashboardService } from '../service/dashboard.service';
import { Request } from 'express';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(): Promise<{
        message: string;
        data: {
            totalBooks: number;
            availableBooks: number;
            issuedBooks: number;
            totalMembers: number;
            activeIssues: number;
            overdueBooks: number;
            pendingRequests: number;
            newArrivals: number;
            todayIssues: number;
        };
    }>;
    getInventorySummary(): Promise<{
        message: string;
        data: {
            totalBooks: number;
            booksByCategory: any[];
        };
    }>;
    getPopularBooks(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../../books/entities/book.entity").Book, {}, {}> & import("../../books/entities/book.entity").Book & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getStatCards(): Promise<{
        message: string;
        data: {
            totalBooks: number;
            availableBooks: number;
            issuedBooks: number;
            overdueBooks: number;
            totalMembers: number;
            newArrivals: number;
            pendingRequests: number;
            todayIssues: number;
        };
    }>;
    getRecentBooks(req: Request): Promise<{
        message: string;
        data: import("../service/dashboard.service").PopulatedRecentBook[];
    }>;
    getOverdueBooks(req: Request): Promise<{
        message: string;
        data: import("../service/dashboard.service").PopulatedRecentBook[];
    }>;
    getPendingRequests(req: Request): Promise<{
        message: string;
        data: any[];
    }>;
    getPending(req: Request): Promise<{
        message: string;
        data: any[];
    }>;
}
