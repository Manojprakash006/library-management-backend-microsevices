import { HydratedDocument, Types } from 'mongoose';
export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;
export declare enum LeaveType {
    SICK_LEAVE = "Sick Leave",
    CASUAL_LEAVE = "Casual Leave",
    PERSONAL_PERMISSION = "Personal Permission",
    EMERGENCY = "Emergency"
}
export declare enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class LeaveRequest {
    staffId: Types.ObjectId;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
    permissionHours: number;
    permissionTime: string;
    fromTime: string;
    toTime: string;
    status: LeaveStatus;
    approvedBy: Types.ObjectId;
    adminRemarks: string;
}
export declare const LeaveRequestSchema: import("mongoose").Schema<LeaveRequest, import("mongoose").Model<LeaveRequest, any, any, any, import("mongoose").Document<unknown, any, LeaveRequest, any, {}> & LeaveRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeaveRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<LeaveRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<LeaveRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
