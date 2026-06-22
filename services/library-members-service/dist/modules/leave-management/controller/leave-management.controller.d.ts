import { LeaveManagementService } from '../service/leave-management.service';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dto/leave-request.dto';
export declare class LeaveManagementController {
    private readonly leaveService;
    constructor(leaveService: LeaveManagementService);
    applyLeave(dto: CreateLeaveRequestDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getStaffLeaves(staffId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAllRequests(status?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/leave-request.entity").LeaveRequest, {}, {}> & import("../entities/leave-request.entity").LeaveRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
