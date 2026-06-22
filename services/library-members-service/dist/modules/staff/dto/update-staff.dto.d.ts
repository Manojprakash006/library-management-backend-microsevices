import { StaffRole, StaffStatus } from '../entities/staff.entity';
export declare class UpdateStaffDto {
    email?: string;
    password?: string;
    fullName?: string;
    phone?: string;
    department?: string;
    shift?: string;
    status?: StaffStatus;
    role?: StaffRole;
    qualification?: string;
    address?: string;
    emergencyContact?: string;
    designation?: string;
    idProofType?: string;
    idProofNumber?: string;
    photoUrl?: string;
}
