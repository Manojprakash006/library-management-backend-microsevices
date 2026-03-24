import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
export declare class ActivityLogService {
    private readonly activityLogModel;
    private readonly logger;
    constructor(activityLogModel: Model<ActivityLogDocument>);
    logAction(createDto: CreateActivityLogDto): Promise<ActivityLog>;
    getLogs(page?: number, limit?: number, filters?: {}): Promise<{
        data: ActivityLog[];
        count: number;
    }>;
    getRecentLogs(limit?: number): Promise<ActivityLog[]>;
}
