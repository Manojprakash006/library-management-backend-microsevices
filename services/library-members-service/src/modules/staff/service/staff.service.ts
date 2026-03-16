import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Staff, StaffDocument } from '../entities/staff.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { StaffLoginDto } from '../dto/staff-login.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: StaffLoginDto) {
    const { email, password } = loginDto;
    const staff = await this.staffModel.findOne({ email }).select('+password');
    
    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      userId: staff._id,
      email: staff.email,
      role: staff.role,
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

  async create(createDto: CreateStaffDto) {
    const existingStaff = await this.staffModel.findOne({ email: createDto.email });
    if (existingStaff) {
      throw new ConflictException('Email already registered');
    }

    const staff = new this.staffModel(createDto);
    await staff.save();
    return staff;
  }

  async findAll() {
    return this.staffModel.find().select('-password');
  }

  async findById(id: string) {
    const staff = await this.staffModel.findById(id).select('-password');
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async update(id: string, updateDto: UpdateStaffDto) {
    const staff = await this.staffModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true, runValidators: true },
    ).select('-password');
    
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async delete(id: string) {
    const staff = await this.staffModel.findByIdAndDelete(id);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
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
}
