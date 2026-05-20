import { HydratedDocument, Types } from 'mongoose';
export type AttendanceDocument = HydratedDocument<Attendance>;
export declare enum AttendanceStatus {
    PRESENT = "Present",
    ABSENT = "Absent",
    HALF_DAY = "Half-day",
    ON_LEAVE = "On Leave",
    LATE = "Late"
}
export declare class Attendance {
    staffId: Types.ObjectId;
    date: string;
    status: AttendanceStatus;
    checkInTime: Date;
    breaks: Array<{
        breakType: string;
        startTime: Date;
        endTime: Date;
    }>;
    checkOutTime: Date;
    remarks: string;
}
export declare const AttendanceSchema: import("mongoose").Schema<Attendance, import("mongoose").Model<Attendance, any, any, any, import("mongoose").Document<unknown, any, Attendance, any, {}> & Attendance & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendance, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Attendance>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Attendance> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
