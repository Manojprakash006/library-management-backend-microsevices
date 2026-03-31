import { Response } from 'express';
import { ActivityLogService } from '../service/activity-log.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    createLog(createActivityLogDto: CreateActivityLogDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getLogs(page?: number, limit?: number, adminId?: string, action?: string, entityType?: string, res?: Response): Promise<Response<any, Record<string, any>> | {
        data: import("../entities/activity-log.entity").ActivityLog[];
        count: number;
    }>;
    getRecentLogs(limit?: number, res?: Response): Promise<Response<any, Record<string, any>> | import("../entities/activity-log.entity").ActivityLog[]>;
}
