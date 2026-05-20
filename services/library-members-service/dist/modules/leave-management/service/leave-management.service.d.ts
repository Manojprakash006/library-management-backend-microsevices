import { Model, Types } from 'mongoose';
import { LeaveRequest, LeaveRequestDocument } from '../entities/leave-request.entity';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dto/leave-request.dto';
export declare class LeaveManagementService {
    private leaveModel;
    constructor(leaveModel: Model<LeaveRequestDocument>);
    applyLeave(dto: CreateLeaveRequestDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getStaffLeaves(staffId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getAllRequests(status?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, LeaveRequest, {}, {}> & LeaveRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
}
