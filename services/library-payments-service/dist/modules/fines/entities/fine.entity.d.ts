import { Document, Types } from 'mongoose';
export type FineDocument = Fine & Document;
export declare enum FineStatus {
    PAID = "PAID",
    UNPAID = "UNPAID"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    UPI = "UPI",
    CARD = "CARD"
}
export declare class Fine {
    fineId: string;
    memberId: Types.ObjectId;
    issueId: Types.ObjectId;
    bookId?: Types.ObjectId;
    amount: number;
    reason: string;
    status: FineStatus;
    paymentMethod?: PaymentMethod;
    paidAt?: Date;
    referenceId?: string;
    razorpayOrderId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FineSchema: import("mongoose").Schema<Fine, import("mongoose").Model<Fine, any, any, any, Document<unknown, any, Fine, any, {}> & Fine & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fine, Document<unknown, {}, import("mongoose").FlatRecord<Fine>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Fine> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
