import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
    const { action, bookId, memberId, userId, description, performedBy } = createActivityLogDto;

    const createdLog = new this.activityLogModel({
      action,
      bookId: bookId ? new Types.ObjectId(bookId) : undefined,
      memberId: memberId ? new Types.ObjectId(memberId) : undefined,
      userId: userId ? new Types.ObjectId(userId) : undefined,
      description,
      performedBy,
      timestamp: new Date(),
    });

    return createdLog.save();
  }

  async findAll(limit: number = 50): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .populate('bookId', 'bookId title')
      .populate('memberId', 'fullName')
      .populate('userId', 'name')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getRecent(limit: number = 10): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .populate('bookId', 'bookId title')
      .populate('memberId', 'fullName')
      .populate('userId', 'name')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByMember(memberId: string, limit: number = 50): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ memberId: new Types.ObjectId(memberId) })
      .populate('bookId', 'bookId title')
      .populate('memberId', 'fullName')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByBook(bookId: string, limit: number = 50): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ bookId: new Types.ObjectId(bookId) })
      .populate('bookId', 'bookId title')
      .populate('memberId', 'fullName')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<ActivityLog> {
    const log = await this.activityLogModel
      .findById(id)
      .populate('bookId', 'bookId title')
      .populate('memberId', 'fullName')
      .populate('userId', 'name')
      .exec();

    if (!log) {
      throw new NotFoundException('Activity log not found');
    }

    return log;
  }

  async remove(id: string): Promise<void> {
    const result = await this.activityLogModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Activity log not found');
    }
  }
}
