import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;
export declare enum NotificationType {
    DUE_REMINDER = "DUE_REMINDER",
    OVERDUE = "OVERDUE",
    RETURN_CONFIRMATION = "RETURN_CONFIRMATION",
    REQUEST_APPROVED = "REQUEST_APPROVED",
    REQUEST_REJECTED = "REQUEST_REJECTED",
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
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, import("mongoose").Document<unknown, any, Notification, any, {}> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
