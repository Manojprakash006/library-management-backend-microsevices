import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Member } from '../../members/entities/member.entity';
import { MemberRegisterDto } from '../dto/member-register.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
import { EmailService } from '../../notifications/service/email.service';
export declare class MemberAuthService {
    private memberModel;
    private jwtService;
    private emailService;
    constructor(memberModel: Model<Member>, jwtService: JwtService, emailService: EmailService);
    register(registerDto: MemberRegisterDto): Promise<{
        token: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(loginDto: MemberLoginDto): Promise<{
        token: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: string;
        };
    }>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, Member, {}, {}> & Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        email: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
