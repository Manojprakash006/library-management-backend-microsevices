import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type BookRenewalDocument = HydratedDocument<BookRenewal>;
export declare enum RenewalStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class BookRenewal {
    renewalId: string;
    issueId: MongooseSchema.Types.ObjectId;
    memberId: MongooseSchema.Types.ObjectId;
    currentDueDate: Date;
    newDueDate: Date;
    status: RenewalStatus;
    requestDate: Date;
    processedDate: Date;
}
export declare const BookRenewalSchema: MongooseSchema<BookRenewal, import("mongoose").Model<BookRenewal, any, any, any, import("mongoose").Document<unknown, any, BookRenewal, any, {}> & BookRenewal & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookRenewal, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookRenewal>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookRenewal> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
