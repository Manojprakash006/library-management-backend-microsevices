import { Model } from 'mongoose';
import { IssueBook, IssueBookDocument } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
export declare class IssuesService {
    private issueBookModel;
    private readonly logger;
    constructor(issueBookModel: Model<IssueBookDocument>);
    create(createIssueDto: CreateIssueDto): Promise<IssueBook>;
    findAll(): Promise<IssueBook[]>;
    findOne(id: string): Promise<IssueBook>;
    findByMember(memberId: string): Promise<IssueBook[]>;
    findActiveByMember(memberId: string): Promise<IssueBook[]>;
    returnBook(id: string): Promise<IssueBook>;
    remove(id: string): Promise<void>;
}
