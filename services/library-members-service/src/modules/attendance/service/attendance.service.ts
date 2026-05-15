import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument, AttendanceStatus } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { SystemConfigService } from '../../system-config/service/system-config.service';
import { StaffService } from '../../staff/service/staff.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    private readonly configService: SystemConfigService,
    private readonly staffService: StaffService,
  ) {}

  private async getLocalTimeInfo() {
    const config = await this.configService.getConfig();
    const timezone = config?.timezone || 'Asia/Kolkata';
    const now = new Date();
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;
    
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hours = parseInt(getPart('hour') || '0');
    const minutes = parseInt(getPart('minute') || '0');
    
    return {
      now,
      today: `${year}-${month}-${day}`,
      minutesSinceMidnight: hours * 60 + minutes,
      config
    };
  }

  private calculateWorkDuration(record: Attendance): number {
    if (!record.checkInTime) return 0;
    const end = record.checkOutTime || new Date();
    const totalMs = end.getTime() - new Date(record.checkInTime).getTime();
    
    // Subtract break durations
    const breakMs = this.calculateBreakDuration(record) * 60000;
    const workMs = Math.max(0, totalMs - breakMs);
    
    return Math.floor(workMs / 60000); // return in minutes
  }

  private calculateBreakDuration(record: Attendance): number {
    let totalMs = 0;
    record.breaks.forEach(b => {
      if (b.startTime) {
        const end = b.endTime || new Date();
        totalMs += end.getTime() - new Date(b.startTime).getTime();
      }
    });
    return Math.floor(totalMs / 60000); // return in minutes
  }

  async markAttendance(dto: CreateAttendanceDto) {
    const existing = await this.attendanceModel.findOne({ staffId: dto.staffId, date: dto.date });
    if (existing) {
      throw new ConflictException('Attendance already marked for this date');
    }

    const attendance = new this.attendanceModel(dto);
    return await attendance.save();
  }

  async checkIn(staffId: string) {
    const { now, today, minutesSinceMidnight, config } = await this.getLocalTimeInfo();
    let attendance = await this.attendanceModel.findOne({ staffId, date: today });

    if (attendance) {
      throw new ConflictException('Already checked in today');
    }

    // Check for open sessions from previous days
    const openSession = await this.attendanceModel.findOne({ 
      staffId, 
      checkOutTime: { $exists: false },
      date: { $ne: today }
    }).sort({ date: -1 });

    if (openSession) {
      // Auto-close previous session at 11:59 PM of that day
      openSession.checkOutTime = openSession.checkOutTime || new Date(new Date(openSession.date).setHours(23, 59, 59));
      openSession.remarks = (openSession.remarks || '') + ' [Auto-closed: Missing clock-out]';
      await openSession.save();
    }

    const staff = await this.staffService.findById(staffId);

    const shift = staff.shift;
    let status = AttendanceStatus.PRESENT;

    // Use specific shift or global config
    const startTimeStr = (shift as any)?.startTime || config?.shiftStartTime || '09:00 AM';
    const gracePeriodMins = (shift as any)?.gracePeriod !== undefined && (shift as any)?.gracePeriod !== null
      ? (shift as any).gracePeriod 
      : (config?.gracePeriod || 15);

    // Parse startTime (e.g. "09:00 AM")
    const [time, modifier] = startTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const shiftMinutesSinceMidnight = hours * 60 + minutes;
    
    const graceLimitMins = shiftMinutesSinceMidnight + gracePeriodMins;
    const halfDayThresholdMins = config?.halfDayLimit || 120;
    const halfDayLimitMins = shiftMinutesSinceMidnight + halfDayThresholdMins;

    if (minutesSinceMidnight > halfDayLimitMins) {
      status = AttendanceStatus.HALF_DAY;
    } else if (minutesSinceMidnight > graceLimitMins) {
      status = AttendanceStatus.LATE;
    }

    attendance = new this.attendanceModel({
      staffId,
      date: today,
      status: status,
      checkInTime: now,
    });

    return await attendance.save();
  }

  async checkOut(staffId: string) {
    const { now, today } = await this.getLocalTimeInfo();
    const attendance = await this.attendanceModel.findOne({ staffId, date: today });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (attendance.checkOutTime) {
      throw new ConflictException('Already checked out today');
    }

    attendance.checkOutTime = new Date();
    return await attendance.save();
  }

  async breakStart(staffId: string, type: string = 'Tea') {
    const { now, today } = await this.getLocalTimeInfo();
    const attendance = await this.attendanceModel.findOne({ staffId, date: today });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    // Check if there is an active break (one without endTime)
    const activeBreak = attendance.breaks.find(b => !b.endTime);
    if (activeBreak) {
      throw new ConflictException('Already on a break');
    }

    // Optional: Check max breaks from shift
    const staff = await this.staffService.findById(staffId);
    const maxAllowed = (staff.shift as any)?.maxBreaks || 3;
    if (attendance.breaks.length >= maxAllowed) {
      throw new ConflictException(`Maximum of ${maxAllowed} breaks allowed per shift`);
    }

    attendance.breaks.push({
      breakType: type,
      startTime: new Date(),
      endTime: null as any
    });

    return await attendance.save();
  }

  async breakEnd(staffId: string) {
    const { now, today } = await this.getLocalTimeInfo();
    const attendance = await this.attendanceModel.findOne({ staffId, date: today });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    const activeBreakIndex = attendance.breaks.findIndex(b => !b.endTime);
    if (activeBreakIndex === -1) {
      throw new ConflictException('No active break found');
    }

    attendance.breaks[activeBreakIndex].endTime = new Date();
    // Mark the array as modified so Mongoose saves it
    attendance.markModified('breaks');
    
    return await attendance.save();
  }

  async getStaffAttendance(staffId: string) {
    const records = await this.attendanceModel.find({ staffId }).sort({ date: -1 }).exec();
    return records.map(r => ({
      ...r.toObject(),
      workDuration: this.calculateWorkDuration(r),
      breakDuration: this.calculateBreakDuration(r)
    }));
  }

  async getAllAttendance(date?: string) {
    const { today } = await this.getLocalTimeInfo();
    const queryDate = date || today;

    // Get all active staff to show who is missing
    const allStaff = await this.staffService.findAll(1, 1000);
    const records = await this.attendanceModel.find({ date: queryDate })
      .populate({
        path: 'staffId',
        select: 'fullName staffId shift status',
        populate: { path: 'shift' }
      })
      .exec();

    const recordMap = new Map();
    records.forEach(r => recordMap.set(r.staffId?._id?.toString() || (r.staffId as any).toString(), r));

    return allStaff.data.map(staff => {
      const record = recordMap.get(staff._id.toString());
      if (record) {
        return {
          ...record.toObject(),
          workDuration: this.calculateWorkDuration(record),
          breakDuration: this.calculateBreakDuration(record)
        };
      } else {
        // Determine status based on time and date
        let status = AttendanceStatus.ABSENT;
        if (queryDate === today) {
          status = 'Not Checked In' as any;
          // You could add logic here to mark as ABSENT if past a certain time
        }
        
        return {
          staffId: staff,
          date: queryDate,
          status: status,
          checkInTime: null,
          checkOutTime: null,
          breaks: [],
          workDuration: 0,
          breakDuration: 0
        };
      }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async markAutoAbsent() {
    const { today, config } = await this.getLocalTimeInfo();
    if (!config?.autoAbsentEnabled) return;
    const allStaff = await this.staffService.findAll(1, 1000);
    
    for (const staff of allStaff.data) {
      const attendance = await this.attendanceModel.findOne({ staffId: staff._id, date: today });
      if (!attendance) {
        await this.attendanceModel.create({
          staffId: staff._id,
          date: today,
          status: AttendanceStatus.ABSENT,
        });
      }
    }
  }
}

