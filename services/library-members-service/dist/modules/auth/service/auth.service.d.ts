import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private readonly activityLogService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, activityLogService: ActivityLogService);
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
    logout(): Promise<{
        message: string;
    }>;
}
