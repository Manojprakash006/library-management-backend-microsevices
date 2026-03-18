import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Staff, StaffDocument } from '../entities/staff.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
export declare class StaffService {
    private staffModel;
    private jwtService;
    constructor(staffModel: Model<StaffDocument>, jwtService: JwtService);
    login(loginDto: StaffLoginDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: import("../entities/staff.entity").StaffRole;
        };
    }>;
    create(createDto: CreateStaffDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
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
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
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
    update(id: string, updateDto: UpdateStaffDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Staff, {}, {}> & Staff & {
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
    delete(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalStaff: number;
        activeStaff: number;
        inactiveStaff: number;
    }>;
}
