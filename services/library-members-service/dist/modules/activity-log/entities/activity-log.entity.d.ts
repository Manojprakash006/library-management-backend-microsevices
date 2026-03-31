import { HydratedDocument } from 'mongoose';
export type ActivityLogDocument = HydratedDocument<ActivityLog>;
export declare class ActivityLog {
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    details: Record<string, any>;
}
export declare const ActivityLogSchema: import("mongoose").Schema<ActivityLog, import("mongoose").Model<ActivityLog, any, any, any, import("mongoose").Document<unknown, any, ActivityLog, any, {}> & ActivityLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ActivityLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ActivityLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ActivityLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
