import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(adminId: string): Promise<{ message: string; data: any }> {
    const admin = await this.userModel.findById(adminId).exec();
    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }
    return { message: 'Admin profile retrieved successfully', data: admin };
  }

  async updateProfile(adminId: string, updateAdminDto: UpdateAdminDto): Promise<{ message: string; data: any }> {
    const admin = await this.userModel.findByIdAndUpdate(adminId, updateAdminDto, { new: true }).exec();
    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }
    return { message: 'Admin profile updated successfully', data: admin };
  }
}
