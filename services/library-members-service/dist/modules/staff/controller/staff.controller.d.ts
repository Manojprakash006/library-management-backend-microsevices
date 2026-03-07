import { StaffService } from '../service/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    staffLogin(loginDto: StaffLoginDto): Promise<{
        message: string;
        data: {
            token: string;
            user: {
                id: import("mongoose").Types.ObjectId;
                email: string;
                fullName: string;
                role: import("../entities/staff.entity").StaffRole;
            };
        };
    }>;
    createStaff(createDto: CreateStaffDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    getAllStaff(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        count: number;
    }>;
    getStaffById(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    updateStaff(id: string, updateDto: UpdateStaffDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/staff.entity").Staff, {}, {}> & import("../entities/staff.entity").Staff & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    deleteStaff(id: string): Promise<{
        message: string;
    }>;
}
