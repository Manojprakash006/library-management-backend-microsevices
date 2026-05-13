import { HydratedDocument, Types } from 'mongoose';
export type BookRequestDocument = HydratedDocument<BookRequest>;
export declare enum RequestStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    CANCELLED = "Cancelled"
}
export declare class BookRequest {
    requestId: string;
    bookId: Types.ObjectId;
    memberId: Types.ObjectId;
    requestType: string;
    requestDate: Date;
    status: RequestStatus;
    currentlyBorrowed: number;
    totalHistory: number;
    activeBookIds: Types.ObjectId[];
    booklistBorrowed: string[];
    processedDate: Date;
}
export declare const BookRequestSchema: any;
