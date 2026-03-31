import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { IssueBook, IssueBookDocument } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
export declare class IssuesService {
    private issueBookModel;
    private readonly httpService;
    private readonly logger;
    constructor(issueBookModel: Model<IssueBookDocument>, httpService: HttpService);
    private logActivity;
    private sendNotification;
    create(createIssueDto: CreateIssueDto, adminId?: string): Promise<IssueBook>;
    private addToBorrowingHistory;
    private updateBookStatus;
    private updateBorrowingHistory;
    private updateBookStatusByObjectId;
    findAll(): Promise<IssueBook[]>;
    findOne(id: string): Promise<IssueBook>;
    findByMember(memberId: string): Promise<IssueBook[]>;
    findActiveByMember(memberId: string): Promise<IssueBook[]>;
    returnBook(id: string, adminId?: string): Promise<IssueBook>;
    update(id: string, updateIssueDto: any, adminId?: string): Promise<IssueBook>;
    findRecent(limit?: number): Promise<IssueBook[]>;
    getOverdueCount(): Promise<number>;
    getIssuesCount(date?: string): Promise<number>;
    getReturnsCount(date?: string): Promise<number>;
    getBookIssueCount(bookId: string): Promise<number>;
    remove(id: string, adminId?: string): Promise<void>;
}
