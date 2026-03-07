import { IssueType } from '../entities/issue-book.entity';
export declare class CreateIssueDto {
    bookId: string;
    memberId: string;
    issueType: IssueType;
    numberOfDays: number;
    issueDate: Date;
}
