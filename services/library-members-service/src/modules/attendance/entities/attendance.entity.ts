import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  HALF_DAY = 'Half-day',
  ON_LEAVE = 'On Leave',
  LATE = 'Late',
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true, index: true })
  staffId: Types.ObjectId;

  @Prop({ required: true, index: true })
  date: string; // YYYY-MM-DD

  @Prop({ type: String, enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status: AttendanceStatus;

  @Prop()
  checkInTime: Date;

  @Prop({
    type: [{
      breakType: { type: String, enum: ['Tea', 'Lunch', 'Other'], default: 'Tea' },
      startTime: { type: Date },
      endTime: { type: Date }
    }],
    default: []
  })
  breaks: Array<{ breakType: string; startTime: Date; endTime: Date }>;

  @Prop()
  checkOutTime: Date;

  @Prop({ trim: true })
  remarks: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
