import { MemberAuthService } from '../service/member-auth.service';
import { MemberRegisterDto } from '../dto/member-register.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/forgot-password.dto';
export declare class MemberAuthController {
    private readonly memberAuthService;
    constructor(memberAuthService: MemberAuthService);
    register(registerDto: MemberRegisterDto): Promise<{
        message: string;
        data: {
            token: any;
            user: {
                id: import("mongoose").Types.ObjectId;
                email: string;
                name: string;
                role: string;
            };
        };
    }>;
    login(loginDto: MemberLoginDto): Promise<{
        message: string;
        data: {
            token: any;
            user: {
                id: import("mongoose").Types.ObjectId;
                email: string;
                name: string;
                role: string;
            };
        };
    }>;
    getProfile(req: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../members/entities/member.entity").Member, {}, {}> & import("../../members/entities/member.entity").Member & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
        data: {
            message: string;
        };
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        data: {
            message: string;
        };
    }>;
}
