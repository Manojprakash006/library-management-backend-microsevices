import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async logAction(createDto: CreateActivityLogDto): Promise<ActivityLog> {
    try {
      const newLog = new this.activityLogModel(createDto);
      return await newLog.save();
    } catch (error) {
      this.logger.error(`Failed to create activity log: ${error.message}`, error.stack);
      // We don't want a logging failure to break the main application flow, so we catch and log it.
      return null;
    }
  }

  async getLogs(page = 1, limit = 20, filters = {}): Promise<{ data: ActivityLog[]; count: number }> {
    const skip = (page - 1) * limit;
    const [data, count] = await Promise.all([
      this.activityLogModel
        .find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.activityLogModel.countDocuments(filters).exec(),
    ]);

    return { data, count };
  }

  async getRecentLogs(limit = 10): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
