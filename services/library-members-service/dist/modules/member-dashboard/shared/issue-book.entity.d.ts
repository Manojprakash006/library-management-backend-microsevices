import { HydratedDocument, Types } from 'mongoose';
export type IssueBookDocument = HydratedDocument<IssueBook>;
export declare enum IssueType {
    READING_INSIDE_LIBRARY = "Reading Inside Library",
    TAKING_HOME = "Taking Home"
}
export declare enum IssueStatus {
    ACTIVE = "Active",
    OVERDUE = "Overdue",
    RETURNED = "Returned"
}
export declare class IssueBook {
    bookId: Types.ObjectId;
    memberId: Types.ObjectId;
    issueType: IssueType;
    numberOfDays: number;
    issueDate: Date;
    dueDate: Date;
    returnDate: Date;
    status: IssueStatus;
    daysOverdue: number;
    fine: number;
    finePerDay: number;
}
export declare const IssueBookSchema: any;
