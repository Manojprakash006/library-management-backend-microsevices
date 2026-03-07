import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Member } from '../../members/entities/member.entity';
import { MemberRegisterDto } from '../dto/member-register.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
export declare class MemberAuthService {
    private memberModel;
    private jwtService;
    constructor(memberModel: Model<Member>, jwtService: JwtService);
    register(registerDto: MemberRegisterDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(loginDto: MemberLoginDto): Promise<{
        token: string;
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
}
