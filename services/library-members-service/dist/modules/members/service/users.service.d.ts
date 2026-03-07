import { Model } from 'mongoose';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    getProfile(userId: string): Promise<{
        message: string;
        data: any;
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: any;
    }>;
}
