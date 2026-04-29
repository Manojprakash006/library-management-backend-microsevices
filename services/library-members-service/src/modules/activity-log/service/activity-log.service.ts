import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { Staff, StaffDocument } from '../../staff/entities/staff.entity';
import { Member, MemberDocument } from '../../members/entities/member.entity';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { isValidObjectId } from 'mongoose';



@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(Staff.name)
    private readonly staffModel: Model<StaffDocument>,
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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

  async getLogs(page = 1, limit = 20, filters = {}): Promise<{ data: any[]; count: number }> {
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

    const resolvedData = await Promise.all(data.map(async (log) => {
      const logObj = log.toObject();
      
      // Resolve Admin Name
      if (isValidObjectId(log.adminId)) {
        const staff = await this.staffModel.findById(log.adminId).exec();
        if (staff) {
          logObj['adminName'] = staff.fullName;
        } else {
          const user = await this.userModel.findById(log.adminId).exec();
          logObj['adminName'] = user ? user.name : 'Unknown Admin';
        }
      } else {
        logObj['adminName'] = log.adminId;
      }

      // Resolve Entity Name
      if (log.entityType === 'MEMBER') {
        const query = isValidObjectId(log.entityId) 
          ? { _id: log.entityId } 
          : { memberId: log.entityId };
        const member = await this.memberModel.findOne(query).exec();
        logObj['entityName'] = member ? member.name : (log.details?.name || log.entityId);
      } else if (log.entityType === 'STAFF') {
        const query = isValidObjectId(log.entityId) 
          ? { _id: log.entityId } 
          : { staffId: log.entityId };
        const staff = await this.staffModel.findOne(query).exec();
        logObj['entityName'] = staff ? staff.fullName : (log.details?.fullName || log.details?.name || log.entityId);
      } else if (log.entityType === 'BOOK') {
        logObj['entityName'] = log.details?.title || log.details?.name || log.entityId;
      } else if (log.entityType === 'ISSUE') {
        logObj['entityName'] = log.details?.bookTitle ? `ISSUE: ${log.details.bookTitle}` : (log.details?.bookId ? `ISSUE: ${log.details.bookId}` : log.entityId);
      } else {
        logObj['entityName'] = log.details?.name || log.details?.fullName || log.details?.title || log.entityId;
      }



      return logObj;
    }));

    return { data: resolvedData, count };
  }


  async getRecentLogs(limit = 10): Promise<any[]> {
    const logs = await this.activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return Promise.all(logs.map(async (log) => {
      const logObj = log.toObject();
      
      // Resolve Admin Name
      if (isValidObjectId(log.adminId)) {
        const admin = await this.staffModel.findById(log.adminId).exec();
        logObj['adminName'] = admin ? admin.fullName : 'Unknown Admin';
      } else {
        logObj['adminName'] = log.adminId;
      }

      // Resolve Entity Name
      if (log.entityType === 'MEMBER') {
        const query = isValidObjectId(log.entityId) 
          ? { _id: log.entityId } 
          : { memberId: log.entityId };
        const member = await this.memberModel.findOne(query).exec();
        logObj['entityName'] = member ? member.name : (log.details?.name || log.entityId);
      } else if (log.entityType === 'STAFF') {
        const query = isValidObjectId(log.entityId) 
          ? { _id: log.entityId } 
          : { staffId: log.entityId };
        const staff = await this.staffModel.findOne(query).exec();
        logObj['entityName'] = staff ? staff.fullName : (log.details?.fullName || log.details?.name || log.entityId);
      } else if (log.entityType === 'BOOK') {
        logObj['entityName'] = log.details?.title || log.details?.name || log.entityId;
      } else {
        logObj['entityName'] = log.details?.name || log.details?.fullName || log.details?.title || log.entityId;
      }


      return logObj;
    }));
  }

}
