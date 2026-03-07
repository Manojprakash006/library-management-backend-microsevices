import { Model } from 'mongoose';
import { BookDocument } from '../../books/entities/book.entity';
interface DailyIssueReturnReport {
    date: string;
    booksIssued: number;
    booksReturned: number;
}
interface OverdueReport {
    overdueStatus: number;
    booksOverdue: number;
}
interface RackInventoryReport {
    rackNumber: string;
    location: string;
    total: number;
    available: number;
    issued: number;
    capacityPercentage: number;
}
interface MemberActivityReport {
    activeMembers: number;
    inactiveMembers: number;
}
export declare class ReportsService {
    private bookModel;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>);
    getDailyIssueReturnReport(): Promise<DailyIssueReturnReport>;
    getOverdueReport(): Promise<OverdueReport>;
    getRackInventoryReport(): Promise<RackInventoryReport[]>;
    getRackInventoryById(rackNumber: string): Promise<RackInventoryReport>;
    getMemberActivityReport(): Promise<MemberActivityReport>;
    getAllReports(): Promise<any>;
}
export {};
