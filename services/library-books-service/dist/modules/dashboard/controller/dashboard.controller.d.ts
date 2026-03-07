import { DashboardService } from '../service/dashboard.service';
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
}
