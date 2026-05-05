import { Model } from 'mongoose';
import { UserDocument } from '../../auth/entities/user.entity';
import { UpdateAdminDto } from '../dto/update-admin.dto';
export declare class AdminService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getProfile(adminId: string): Promise<{
        message: string;
        data: any;
    }>;
    updateProfile(adminId: string, updateAdminDto: UpdateAdminDto): Promise<{
        message: string;
        data: any;
    }>;
}
