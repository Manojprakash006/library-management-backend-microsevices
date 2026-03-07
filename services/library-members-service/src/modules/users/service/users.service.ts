import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.memberModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateDto: UpdateUserDto) {
    const user = await this.memberModel.findByIdAndUpdate(
      userId,
      { $set: updateDto },
      { new: true, runValidators: true },
    ).select('-password');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async listUsers() {
    return this.memberModel.find().select('-password');
  }
}
