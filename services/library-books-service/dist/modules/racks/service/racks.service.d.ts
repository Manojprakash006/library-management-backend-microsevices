import { Model } from 'mongoose';
import { BookDocument } from '../../books/entities/book.entity';
interface RackInfo {
    rackNumber: string;
    location: string;
    totalBooks: number;
    available: number;
    issued: number;
    capacity: number;
    capacityPercentage?: string;
    books?: any[];
    recentBooks?: any[];
    booksByCategory?: Record<string, any[]>;
}
export declare class RacksService {
    private bookModel;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>);
    findAll(): Promise<RackInfo[]>;
    findByRackNumber(rackNumber: string): Promise<RackInfo>;
}
export {};
