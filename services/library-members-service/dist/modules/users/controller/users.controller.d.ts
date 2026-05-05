import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../members/entities/member.entity").Member, {}, {}> & import("../../members/entities/member.entity").Member & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    updateProfile(req: any, updateDto: UpdateUserDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../members/entities/member.entity").Member, {}, {}> & import("../../members/entities/member.entity").Member & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    listUsers(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("../../members/entities/member.entity").Member, {}, {}> & import("../../members/entities/member.entity").Member & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        count: number;
    }>;
}
