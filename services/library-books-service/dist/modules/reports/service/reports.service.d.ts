import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
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
    private readonly httpService;
    private readonly logger;
    constructor(bookModel: Model<BookDocument>, httpService: HttpService);
    getDailyIssueReturnReport(): Promise<DailyIssueReturnReport>;
    getOverdueReport(): Promise<OverdueReport>;
    getRackInventoryReport(): Promise<RackInventoryReport[]>;
    getRackInventoryById(rackNumber: string): Promise<RackInventoryReport>;
    getMemberActivityReport(authHeader?: string): Promise<MemberActivityReport>;
    getAllReports(authHeader?: string): Promise<any>;
    private getTodayIssuesCount;
    private getTodayReturnsCount;
    private getOverdueBooksCount;
    private getBookIssueCount;
    private getAllBookIssueCounts;
    private getActiveMembersCount;
    private getInactiveMembersCount;
}
export {};
