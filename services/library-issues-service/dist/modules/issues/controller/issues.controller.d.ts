import { IssuesService } from '../service/issues.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { IssueBook } from '../entities/issue-book.entity';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    create(createIssueDto: CreateIssueDto, req: any): Promise<{
        message: string;
        data: IssueBook;
    }>;
    findAll(): Promise<{
        message: string;
        data: IssueBook[];
        count: number;
    }>;
    getMemberStats(memberId: string): Promise<{
        message: string;
        data: {
            booksAtHome: number;
            readingInsideLibrary: number;
            totalActive: number;
        };
    }>;
    findIssuedByMember(memberId: string): Promise<{
        message: string;
        data: IssueBook[];
        count: number;
    }>;
    findRecent(limit: string): Promise<{
        message: string;
        issues: IssueBook[];
    }>;
    getOverdueCount(): Promise<{
        count: number;
    }>;
    getIssuesCount(date: string): Promise<{
        count: number;
    }>;
    getReturnsCount(date: string): Promise<{
        count: number;
    }>;
    getBookIssueCount(bookId: string): Promise<{
        count: number;
    }>;
    findOverdue(): Promise<{
        message: string;
        data: IssueBook[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: IssueBook;
    }>;
    update(id: string, updateIssueDto: any, req: any): Promise<{
        message: string;
        data: IssueBook;
    }>;
    returnBook(id: string, req: any): Promise<{
        message: string;
        data: IssueBook;
        fine: any;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
