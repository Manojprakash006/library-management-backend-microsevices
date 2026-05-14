import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeaveRequest, LeaveRequestDocument, LeaveStatus } from '../entities/leave-request.entity';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from '../dto/leave-request.dto';

@Injectable()
export class LeaveManagementService {
  constructor(
    @InjectModel(LeaveRequest.name) private leaveModel: Model<LeaveRequestDocument>,
  ) {}

  async applyLeave(dto: CreateLeaveRequestDto) {
    const leave = new this.leaveModel({
      ...dto,
      staffId: new Types.ObjectId(dto.staffId),
    });
    return await leave.save();
  }

  async updateStatus(id: string, dto: UpdateLeaveStatusDto) {
    const leave = await this.leaveModel.findById(id);
    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    leave.status = dto.status as LeaveStatus;
    leave.approvedBy = new Types.ObjectId(dto.adminId);
    leave.adminRemarks = dto.adminRemarks;

    return await leave.save();
  }

  async getStaffLeaves(staffId: string) {
    return await this.leaveModel.find({ staffId: new Types.ObjectId(staffId) }).sort({ createdAt: -1 }).exec();
  }

  async getAllRequests(status?: string) {
    const query = status ? { status } : {};
    return await this.leaveModel.find(query).populate('staffId', 'fullName staffId').sort({ createdAt: -1 }).exec();
  }
}
