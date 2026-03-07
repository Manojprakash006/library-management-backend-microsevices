import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type ActivityLogDocument = HydratedDocument<ActivityLog>;
export declare class ActivityLog {
    action: string;
    bookId: MongooseSchema.Types.ObjectId;
    memberId: MongooseSchema.Types.ObjectId;
    userId: MongooseSchema.Types.ObjectId;
    description: string;
    performedBy: string;
    timestamp: Date;
}
export declare const ActivityLogSchema: MongooseSchema<ActivityLog, import("mongoose").Model<ActivityLog, any, any, any, import("mongoose").Document<unknown, any, ActivityLog, any, {}> & ActivityLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ActivityLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ActivityLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ActivityLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
