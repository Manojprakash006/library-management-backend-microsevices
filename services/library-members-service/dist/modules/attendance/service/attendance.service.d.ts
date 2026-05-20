import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { SystemConfigService } from '../../system-config/service/system-config.service';
import { StaffService } from '../../staff/service/staff.service';
export declare class AttendanceService {
    private attendanceModel;
    private readonly configService;
    private readonly staffService;
    constructor(attendanceModel: Model<AttendanceDocument>, configService: SystemConfigService, staffService: StaffService);
    markAttendance(dto: CreateAttendanceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    checkIn(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    checkOut(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    breakStart(staffId: string, type?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    breakEnd(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getStaffAttendance(staffId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAllAttendance(date?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Attendance, {}, {}> & Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    markAutoAbsent(): Promise<void>;
}
