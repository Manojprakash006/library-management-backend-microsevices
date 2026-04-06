import { HydratedDocument } from 'mongoose';
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
    shift: string;
    status: StaffStatus;
    role: StaffRole;
    qualification: string;
    address: string;
    emergencyContact: string;
    isActive: boolean;
}
export declare const StaffSchema: any;
