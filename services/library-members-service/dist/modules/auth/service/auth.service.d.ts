import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../entities/user.entity';
import { StaffDocument } from '../../staff/entities/staff.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
export declare class AuthService {
    private userModel;
    private staffModel;
    private jwtService;
    private readonly activityLogService;
    constructor(userModel: Model<UserDocument>, staffModel: Model<StaffDocument>, jwtService: JwtService, activityLogService: ActivityLogService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    refreshToken(): Promise<{
        message: string;
    }>;
    logout(userId: string, role: string): Promise<{
        message: string;
    }>;
}
