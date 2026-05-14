import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { BookDocument } from '../../books/entities/book.entity';
import { ConfigService } from '../../library-config/service/config.service';
interface ShelfInfo {
    shelfNumber: string;
    totalBooks: number;
    totalQuantity: number;
    capacity: number;
}
interface RackInfo {
    rackNumber: string;
    location: string;
    totalBooks: number;
    totalQuantity: number;
    available: number;
    issued: number;
    capacity: number;
    capacityPercentage?: string;
    shelves?: Record<string, ShelfInfo>;
    books?: any[];
    recentBooks?: any[];
    booksByCategory?: Record<string, any[]>;
    damagedQuantity: number;
}
export declare class RacksService {
    private bookModel;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>, httpService: HttpService, configService: ConfigService);
    findAll(): Promise<RackInfo[]>;
    private getIssuedCountForBook;
    findByRackNumber(rackNumber: string): Promise<RackInfo>;
}
export {};
