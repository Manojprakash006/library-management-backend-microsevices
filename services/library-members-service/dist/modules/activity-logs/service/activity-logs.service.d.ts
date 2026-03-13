import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
export declare class ActivityLogsService {
    private activityLogModel;
    private readonly logger;
    constructor(activityLogModel: Model<ActivityLogDocument>);
    create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog>;
    findAll(limit?: number): Promise<ActivityLog[]>;
    getRecent(limit?: number): Promise<ActivityLog[]>;
    findByMember(memberId: string, limit?: number): Promise<ActivityLog[]>;
    findByBook(bookId: string, limit?: number): Promise<ActivityLog[]>;
    findOne(id: string): Promise<ActivityLog>;
    remove(id: string): Promise<void>;
}
