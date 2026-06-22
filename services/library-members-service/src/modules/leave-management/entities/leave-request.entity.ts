import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;

export enum LeaveType {
  SICK_LEAVE = 'Sick Leave',
  CASUAL_LEAVE = 'Casual Leave',
  PERSONAL_PERMISSION = 'Personal Permission',
  EMERGENCY = 'Emergency',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class LeaveRequest {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true, index: true })
  staffId: Types.ObjectId;

  @Prop({ type: String, enum: LeaveType, required: true })
  leaveType: LeaveType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, trim: true })
  reason: string;

  @Prop()
  permissionHours: number; // For short permissions like 2 hours

  @Prop()
  permissionTime: string; // Specific time for permission

  @Prop()
  fromTime: string; // Start time for permission

  @Prop()
  toTime: string; // End time for permission

  @Prop({ type: String, enum: LeaveStatus, default: LeaveStatus.PENDING, index: true })
  status: LeaveStatus;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  approvedBy: Types.ObjectId;

  @Prop()
  adminRemarks: string;
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
