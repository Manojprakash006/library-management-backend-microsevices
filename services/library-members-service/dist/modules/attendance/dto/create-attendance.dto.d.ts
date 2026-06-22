import { AttendanceStatus } from '../entities/attendance.entity';
export declare class CreateAttendanceDto {
    staffId: string;
    date: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
    remarks?: string;
}
