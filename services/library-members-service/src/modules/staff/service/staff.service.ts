import { Injectable, UnauthorizedException, NotFoundException, ConflictException, UploadedFile, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Staff, StaffDocument, StaffStatus } from '../entities/staff.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    private jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
    private readonly redisEmitter: RedisEmitterService,
  ) { }

  async login(loginDto: StaffLoginDto) {
    const { email, password } = loginDto;
    const staff = await this.staffModel.findOne({ email }).select('+password').populate('shift');

    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Account is disabled. Please contact admin.');
    }

    staff.status = StaffStatus.ACTIVE;
    await staff.save();

    const token = this.jwtService.sign({
      userId: staff._id,
      email: staff.email,
      role: staff.role,
    });

    // Log staff login activity
    await this.activityLogService.logAction({
      adminId: staff._id.toString(),
      action: 'STAFF_LOGIN',
      entityType: 'AUTH',
      entityId: staff._id.toString(),
      details: { email: staff.email, fullName: staff.fullName }
    });

    return {
      token,
      user: {
        id: staff._id,
        email: staff.email,
        fullName: staff.fullName,
        role: staff.role,
      },
    };
  }

  async logout(staffId: string) {
    const staff = await this.staffModel.findById(staffId);
    console.log("logout before save :", staff);

    if(!staff) {
      throw new NotFoundException("Staff not found");
    }

    if (staff) {
      staff.status = StaffStatus.INACTIVE;
      staff.lastActive = new Date();
      
      await staff.save();
      
      await this.activityLogService.logAction({
        adminId: staff._id.toString(),
        action: 'STAFF_LOGOUT',
        entityType: 'AUTH',
        entityId: staff._id.toString(),
        details: { email: staff.email, fullName: staff.fullName }
      });
    }
    return { message: 'Logged out successfully' };
  }

  async create(createDto: CreateStaffDto, adminId?: string) {
    const existingStaff = await this.staffModel.findOne({ email: createDto.email });
    if (existingStaff) {
      throw new ConflictException('Email already registered');
    }

    const staff = new this.staffModel(createDto);
    const savedStaff = await staff.save();

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'CREATE',
        entityType: 'STAFF',
        entityId: savedStaff._id.toString(),
        details: { email: savedStaff.email, fullName: savedStaff.fullName }
      });
    }

    await this.redisEmitter.emit('STAFF_UPDATED', { action: 'create', staffId: savedStaff._id });

    return savedStaff;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [staff, total] = await Promise.all([
      this.staffModel.find().select('-password').populate('shift').sort({ _id: -1 }).skip(skip).limit(limit).exec(),
      this.staffModel.countDocuments().exec(),
    ]);

    return {
      data: staff,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const staff = await this.staffModel.findById(id).select('-password').populate('shift');
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async update(id: string, updateDto: UpdateStaffDto, adminId?: string) {
    if (updateDto.email) {
      const existingStaff = await this.staffModel.findOne({ email: updateDto.email, _id: { $ne: id } });
      if (existingStaff) {
        throw new ConflictException('Email already registered');
      }
    }

    if (updateDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateDto.password = await bcrypt.hash(updateDto.password, salt);
    }

    const staff = await this.staffModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true, runValidators: true },
    ).select('-password');

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'UPDATE',
        entityType: 'STAFF',
        entityId: id,
        details: { updatedFields: Object.keys(updateDto) }
      });
    }

    await this.redisEmitter.emit('STAFF_UPDATED', { action: 'update', staffId: id });

    return staff;
  }

  async delete(id: string, adminId?: string) {
    const staff = await this.staffModel.findByIdAndDelete(id);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'DELETE',
        entityType: 'STAFF',
        entityId: id,
        details: { email: staff.email }
      });
    }

    await this.redisEmitter.emit('STAFF_UPDATED', { action: 'delete', staffId: id });

    return { message: 'Staff deleted successfully' };
  }

  async getStats(): Promise<{ totalStaff: number; activeStaff: number; inactiveStaff: number }> {
    const totalStaff = await this.staffModel.countDocuments();
    const activeStaff = await this.staffModel.countDocuments({ status: 'Active' });
    const inactiveStaff = await this.staffModel.countDocuments({ status: 'Inactive' });

    return {
      totalStaff,
      activeStaff,
      inactiveStaff,
    };
  }

  async updateLastActive(userId: string) {
    if (userId) {
      await this.staffModel.findByIdAndUpdate(userId, {
        lastActive: new Date()}, 
      {timestamps: false,});
    }
  }
}
