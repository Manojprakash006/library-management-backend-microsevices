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

  async markAttendance(dto: CreateAttendanceDto) {
    const existing = await this.attendanceModel.findOne({ staffId: dto.staffId, date: dto.date });
    if (existing) {
      throw new ConflictException('Attendance already marked for this date');
    }

    const attendance = new this.attendanceModel(dto);
    return await attendance.save();
  }

  async checkIn(staffId: string) {
    const today = new Date().toISOString().split('T')[0];
    let attendance = await this.attendanceModel.findOne({ staffId, date: today });

    if (attendance) {
      throw new ConflictException('Already checked in today');
    }

    const staff = await this.staffService.findById(staffId);
    const shift = staff.shift;
    const now = new Date();
    let status = AttendanceStatus.PRESENT;

    if (shift) {
      // Parse shiftStartTime (e.g. "09:00 AM")
      const [time, modifier] = shift.startTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const shiftStart = new Date();
      shiftStart.setHours(hours, minutes, 0, 0);
      
      const graceTime = new Date(shiftStart.getTime() + (shift.gracePeriod || 15) * 60000);

      if (now > graceTime) {
        status = AttendanceStatus.LATE;
      }
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
    const today = new Date().toISOString().split('T')[0];
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
    const today = new Date().toISOString().split('T')[0];
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
    const maxAllowed = staff.shift?.maxBreaks || 3;
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
    const today = new Date().toISOString().split('T')[0];
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
    return await this.attendanceModel.find({ staffId }).sort({ date: -1 }).exec();
  }

  async getAllAttendance(date?: string) {
    const query = date ? { date } : {};
    return await this.attendanceModel.find(query).populate('staffId', 'fullName staffId').sort({ date: -1 }).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async markAutoAbsent() {
    const config = await this.configService.getConfig();
    if (!config?.autoAbsentEnabled) return;

    const today = new Date().toISOString().split('T')[0];
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
