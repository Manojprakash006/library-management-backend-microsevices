import { Response } from 'express';
import { ActivityLogService } from '../service/activity-log.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    createLog(createActivityLogDto: CreateActivityLogDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getLogs(page?: number, limit?: number, adminId?: string, action?: string, entityType?: string, res?: Response): Promise<{
        data: import("../entities/activity-log.entity").ActivityLog[];
        count: number;
    } | Response<any, Record<string, any>>>;
    getRecentLogs(limit?: number, res?: Response): Promise<import("../entities/activity-log.entity").ActivityLog[] | Response<any, Record<string, any>>>;
}
