import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type BookDamageReportDocument = HydratedDocument<BookDamageReport>;
export declare enum DamageReportReason {
    LOST = "Lost",
    DAMAGED = "Damaged"
}
export declare enum DamageReportStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class BookDamageReport {
    reportId: string;
    issueId: MongooseSchema.Types.ObjectId;
    bookId: MongooseSchema.Types.ObjectId;
    memberId: MongooseSchema.Types.ObjectId;
    reason: DamageReportReason;
    bookAmount: number;
    fineAmount: number;
    totalAmount: number;
    status: DamageReportStatus;
    reportDate: Date;
    processedDate: Date;
}
export declare const BookDamageReportSchema: MongooseSchema<BookDamageReport, import("mongoose").Model<BookDamageReport, any, any, any, import("mongoose").Document<unknown, any, BookDamageReport, any, {}> & BookDamageReport & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookDamageReport, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<BookDamageReport>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BookDamageReport> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
