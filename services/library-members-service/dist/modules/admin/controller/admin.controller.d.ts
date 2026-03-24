import { AdminService } from '../service/admin.service';
import { UpdateAdminDto } from '../dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getProfile(req: any): Promise<{
        message: string;
        data: any;
    }>;
    updateProfile(req: any, updateAdminDto: UpdateAdminDto): Promise<{
        message: string;
        data: any;
    }>;
}
