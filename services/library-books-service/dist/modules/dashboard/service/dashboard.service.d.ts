import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';
export declare class DashboardService {
    private bookModel;
    constructor(bookModel: Model<BookDocument>);
    getDashboardStats(): Promise<{
        totalBooks: number;
        availableBooks: number;
        issuedBooks: number;
        totalMembers: number;
        activeIssues: number;
        overdueBooks: number;
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
}
