import { Document } from 'mongoose';
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
    memberId: string;
    issueId: string;
    amount: number;
    reason: string;
    status: FineStatus;
    paymentMethod?: PaymentMethod;
    paidAt?: Date;
    referenceId?: string;
    razorpayOrderId?: string;
}
export declare const FineSchema: import("mongoose").Schema<Fine, import("mongoose").Model<Fine, any, any, any, Document<unknown, any, Fine, any, {}> & Fine & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fine, Document<unknown, {}, import("mongoose").FlatRecord<Fine>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Fine> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
