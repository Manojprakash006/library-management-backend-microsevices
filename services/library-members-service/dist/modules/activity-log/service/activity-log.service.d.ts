import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { StaffDocument } from '../../staff/entities/staff.entity';
import { MemberDocument } from '../../members/entities/member.entity';
import { UserDocument } from '../../auth/entities/user.entity';
export declare class ActivityLogService {
    private readonly activityLogModel;
    private readonly staffModel;
    private readonly memberModel;
    private readonly userModel;
    private readonly logger;
    constructor(activityLogModel: Model<ActivityLogDocument>, staffModel: Model<StaffDocument>, memberModel: Model<MemberDocument>, userModel: Model<UserDocument>);
    logAction(createDto: CreateActivityLogDto): Promise<ActivityLog>;
    getLogs(page?: number, limit?: number, filters?: {}): Promise<{
        data: any[];
        count: number;
    }>;
    getRecentLogs(limit?: number): Promise<any[]>;
}
