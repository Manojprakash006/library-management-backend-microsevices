import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { Staff, StaffDocument, StaffStatus } from '../../staff/entities/staff.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    private jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
  ) { }

  async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).select('+password').exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let designation = 'Staff';
    if (user.role === 'staff') {
      const staff = await this.staffModel.findOne({ email: user.email });
      if (staff) {
        designation = staff.designation || 'Staff';
        staff.status = StaffStatus.ACTIVE;
        await staff.save();
      }
    }

    const token = this.jwtService.sign({ 
      id: user._id, 
      role: user.role,
      designation: user.role === 'admin' ? 'Admin' : designation 
    });

    if (user.role === 'admin') {
      await this.activityLogService.logAction({
        adminId: user._id.toString(),
        action: 'ADMIN_LOGIN',
        entityType: 'AUTH',
        entityId: user._id.toString(),
        details: { email: user.email }
      });
    }

    return {
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        designation: user.role === 'admin' ? 'Admin' : designation
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<{ token: string; user: any }> {
    const { name, email, password, role } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userModel.create({ name, email, password, role });

    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async refreshToken(): Promise<{ message: string }> {
    return { message: 'Refresh token not implemented' };
  }

  async logout(userId: string, role: string): Promise<{ message: string }> {
    if (role === 'staff') {
      const staff = await this.staffModel.findById(userId);
      if (staff) {
        staff.status = StaffStatus.INACTIVE;
        await staff.save();

        await this.activityLogService.logAction({
          adminId: userId,
          action: 'STAFF_LOGOUT',
          entityType: 'AUTH',
          entityId: userId,
          details: { email: staff.email, fullName: staff.fullName }
        });
      }
    }
    return { message: 'Logged out' };
  }
}
