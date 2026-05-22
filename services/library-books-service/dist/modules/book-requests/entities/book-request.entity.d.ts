import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type BookRequestDocument = HydratedDocument<BookRequest>;
export declare enum BookRequestStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class BookRequest {
    requestId: string;
    bookId: Types.ObjectId;
    memberId: Types.ObjectId;
    requestDate: Date;
    status: BookRequestStatus;
    currentlyBorrowed: number;
    totalHistory: number;
    activeBookIds: Types.ObjectId[];
    booklistBorrowed: string[];
    processedDate: Date;
    processedBy: Types.ObjectId;
}
export declare const BookRequestSchema: MongooseSchema<BookRequest, import("mongoose").Model<BookRequest, any, any, any, import("mongoose").Document<unknown, any, BookRequest, any, {}> & BookRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
