import { Model } from 'mongoose';
import { BookDocument } from '../../books/entities/book.entity';
export declare class UtilService {
    private bookModel;
    constructor(bookModel: Model<BookDocument>);
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    clearAll(): Promise<{
        message: string;
    }>;
}
