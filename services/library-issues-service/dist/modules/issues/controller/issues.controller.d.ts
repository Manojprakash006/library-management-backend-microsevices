import { IssuesService } from '../service/issues.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { IssueBook } from '../entities/issue-book.entity';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    create(createIssueDto: CreateIssueDto): Promise<{
        message: string;
        data: IssueBook;
    }>;
    findAll(): Promise<{
        message: string;
        data: IssueBook[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: IssueBook;
    }>;
    returnBook(id: string): Promise<{
        message: string;
        data: IssueBook;
        fine: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
