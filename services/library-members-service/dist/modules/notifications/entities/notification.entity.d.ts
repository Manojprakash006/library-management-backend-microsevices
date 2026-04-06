import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;
export declare enum NotificationType {
    DUE_REMINDER = "DUE_REMINDER",
    OVERDUE = "OVERDUE",
    RETURN_CONFIRMATION = "RETURN_CONFIRMATION",
    REQUEST_APPROVED = "REQUEST_APPROVED",
    REQUEST_REJECTED = "REQUEST_REJECTED",
    NEW_BOOK_REQUEST = "NEW_BOOK_REQUEST",
    NEW_BOOK_ADDED = "NEW_BOOK_ADDED",
    BOOK_ISSUED = "BOOK_ISSUED",
    BOOK_RETURNED = "BOOK_RETURNED",
    GENERAL = "GENERAL"
}
export declare class Notification {
    memberId: MongooseSchema.Types.ObjectId;
    issueId: MongooseSchema.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    sentAt: Date;
}
export declare const NotificationSchema: any;
