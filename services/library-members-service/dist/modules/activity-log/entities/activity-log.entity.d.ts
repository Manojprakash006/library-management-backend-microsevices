import { HydratedDocument } from 'mongoose';
export type ActivityLogDocument = HydratedDocument<ActivityLog>;
export declare class ActivityLog {
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    details: Record<string, any>;
}
export declare const ActivityLogSchema: any;
