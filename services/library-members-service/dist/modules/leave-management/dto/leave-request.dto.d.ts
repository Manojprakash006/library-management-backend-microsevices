import { LeaveType } from '../entities/leave-request.entity';
export declare class CreateLeaveRequestDto {
    staffId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    permissionHours?: number;
    permissionTime?: string;
    fromTime?: string;
    toTime?: string;
}
export declare class UpdateLeaveStatusDto {
    status: 'APPROVED' | 'REJECTED';
    adminId: string;
    adminRemarks?: string;
}
