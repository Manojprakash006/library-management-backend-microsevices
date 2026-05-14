import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type BookRequestDocument = HydratedDocument<BookRequest>;
export declare enum BookRequestStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class BookRequest {
    requestId: string;
    bookId: MongooseSchema.Types.ObjectId;
    memberId: MongooseSchema.Types.ObjectId;
    requestDate: Date;
    status: BookRequestStatus;
    currentlyBorrowed: number;
    totalHistory: number;
    activeBookIds: MongooseSchema.Types.ObjectId[];
    booklistBorrowed: string[];
    processedDate: Date;
}
export declare const BookRequestSchema: any;
