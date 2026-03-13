import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { BookRequestDocument } from '../../book-requests/entities/book-request.entity';
export interface PopulatedRecentBook {
    _id: string;
    book: {
        _id: string;
        title: string;
        author: string;
        isbn: string;
        category: string;
    };
    member: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    issueType: string;
    numberOfDays: number;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: string;
    daysOverdue: number;
    fine: number;
    finePerDay: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DashboardService {
    private bookModel;
    private bookRequestModel;
    private readonly httpService;
    constructor(bookModel: Model<BookDocument>, bookRequestModel: Model<BookRequestDocument>, httpService: HttpService);
    getDashboardStats(): Promise<{
        totalBooks: number;
        availableBooks: number;
        issuedBooks: number;
        totalMembers: number;
        activeIssues: number;
        overdueBooks: number;
        pendingRequests: number;
        newArrivals: number;
        todayIssues: number;
    }>;
    getInventorySummary(): Promise<{
        totalBooks: number;
        booksByCategory: any[];
    }>;
    getPopularBooks(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getStatCards(): Promise<{
        totalBooks: number;
        availableBooks: number;
        issuedBooks: number;
        overdueBooks: number;
        totalMembers: number;
        newArrivals: number;
        pendingRequests: number;
        todayIssues: number;
    }>;
    getRecentBooks(authHeader?: string): Promise<PopulatedRecentBook[]>;
    private fetchBookDetails;
    private fetchMemberDetails;
    getOverdueBooks(authHeader?: string): Promise<PopulatedRecentBook[]>;
    getPendingRequests(authHeader?: string): Promise<any[]>;
    private getActiveIssuesCount;
    private getPendingRequestsCount;
    private getOverdueBooksCount;
    private getTotalMembersCount;
    private getNewArrivalsCount;
    private getTodayIssuesCount;
}
