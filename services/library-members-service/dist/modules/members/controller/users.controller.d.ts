import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
import { User } from '../../auth/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listUsers(): Promise<{
        message: string;
        data: User[];
        count: number;
    }>;
    getProfile(req: any): Promise<{
        message: string;
        data: any;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: any;
    }>;
}
