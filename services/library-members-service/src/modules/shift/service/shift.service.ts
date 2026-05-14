import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift, ShiftDocument } from '../entities/shift.entity';
import { CreateShiftDto, UpdateShiftDto } from '../dto/shift.dto';

@Injectable()
export class ShiftService implements OnModuleInit {
  constructor(@InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>) {}

  async onModuleInit() {
    // Create default "General" shift if it doesn't exist
    const count = await this.shiftModel.countDocuments();
    if (count === 0) {
      await this.shiftModel.create({
        name: 'General',
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        gracePeriod: 15,
        lunchDuration: 60,
      });
    }
  }

  async create(dto: CreateShiftDto) {
    const existing = await this.shiftModel.findOne({ name: dto.name });
    if (existing) {
      throw new ConflictException('Shift name already exists');
    }
    const shift = new this.shiftModel(dto);
    return await shift.save();
  }

  async findAll() {
    return await this.shiftModel.find({ isActive: true }).exec();
  }

  async findOne(id: string) {
    const shift = await this.shiftModel.findById(id);
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }

  async update(id: string, dto: UpdateShiftDto) {
    const shift = await this.shiftModel.findByIdAndUpdate(id, dto, { new: true });
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }

  async remove(id: string) {
    const shift = await this.shiftModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }
}
