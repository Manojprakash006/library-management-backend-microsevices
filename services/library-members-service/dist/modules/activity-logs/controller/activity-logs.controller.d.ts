import { ActivityLogsService } from '../service/activity-logs.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { ActivityLog } from '../entities/activity-log.entity';
export declare class ActivityLogsController {
    private readonly activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    create(createActivityLogDto: CreateActivityLogDto): Promise<{
        message: string;
        data: ActivityLog;
    }>;
    findAll(limit?: number): Promise<{
        message: string;
        data: ActivityLog[];
        count: number;
    }>;
    findByMember(memberId: string, limit?: number): Promise<{
        message: string;
        data: ActivityLog[];
        count: number;
    }>;
    findByBook(bookId: string, limit?: number): Promise<{
        message: string;
        data: ActivityLog[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: ActivityLog;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
