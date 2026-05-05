import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Staff, StaffDocument } from '../entities/staff.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
export declare class StaffService {
    private staffModel;
    private jwtService;
    private readonly activityLogService;
    private readonly redisEmitter;
    constructor(staffModel: Model<StaffDocument>, jwtService: JwtService, activityLogService: ActivityLogService, redisEmitter: RedisEmitterService);
    login(loginDto: StaffLoginDto): Promise<{
        token: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: import("../entities/staff.entity").StaffRole;
        };
    }>;
    logout(staffId: string): Promise<{
        message: string;
    }>;
    create(createDto: CreateStaffDto, adminId?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateDto: UpdateStaffDto, adminId?: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    delete(id: string, adminId?: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalStaff: number;
        activeStaff: number;
        inactiveStaff: number;
    }>;
    updateLastActive(userId: string): Promise<void>;
}
