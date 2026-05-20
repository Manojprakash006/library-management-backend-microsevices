import { StaffRole } from '../entities/staff.entity';
export declare class CreateStaffDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    department: string;
    shift: string;
    qualification: string;
    address: string;
    emergencyContact: string;
    role: StaffRole;
    designation: string;
    idProofType: string;
    idProofNumber: string;
    photoUrl: string;
}
