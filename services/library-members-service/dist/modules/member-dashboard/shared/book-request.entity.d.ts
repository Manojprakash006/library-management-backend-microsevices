import { HydratedDocument, Types } from 'mongoose';
export type BookRequestDocument = HydratedDocument<BookRequest>;
export declare enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
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
export declare const BookRequestSchema: import("mongoose").Schema<BookRequest, import("mongoose").Model<BookRequest, any, any, any, import("mongoose").Document<unknown, any, BookRequest, any, {}> & BookRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
