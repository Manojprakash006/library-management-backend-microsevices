import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
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
