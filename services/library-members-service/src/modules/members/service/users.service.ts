import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async getProfile(userId: string): Promise<{ message: string; data: any }> {
    const user = await this.userModel.findById(userId).exec();
    return { message: 'Profile retrieved successfully', data: user };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{ message: string; data: any }> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
    return { message: 'Profile updated successfully', data: user };
  }
}
