import { AttendanceService } from '../service/attendance.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(dto: CreateAttendanceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    checkIn(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    checkOut(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    breakStart(staffId: string, type: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    breakEnd(staffId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getStaffAttendance(staffId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAllAttendance(date?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/attendance.entity").Attendance, {}, {}> & import("../entities/attendance.entity").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
