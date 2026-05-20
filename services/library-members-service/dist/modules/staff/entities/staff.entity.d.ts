import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Shift } from '../../shift/entities/shift.entity';
export type StaffDocument = HydratedDocument<Staff>;
export declare enum StaffRole {
    ADMIN = "admin",
    STAFF = "staff"
}
export declare enum StaffStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class Staff {
    staffId: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    shift: Shift;
    status: StaffStatus;
    role: StaffRole;
    qualification: string;
    designation: string;
    idProofType: string;
    idProofNumber: string;
    photoUrl: string;
    address: string;
    emergencyContact: string;
    department: string;
    isActive: boolean;
    lastActive: Date;
}
export declare const StaffSchema: MongooseSchema<Staff, import("mongoose").Model<Staff, any, any, any, import("mongoose").Document<unknown, any, Staff, any, {}> & Staff & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Staff, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Staff>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Staff> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
