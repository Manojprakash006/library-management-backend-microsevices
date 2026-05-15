import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShiftDocument = HydratedDocument<Shift>;

@Schema({ timestamps: true })
export class Shift {
  @Prop({ required: true, unique: true, trim: true })
  name: string; // e.g., "General", "Morning", "Night"

  @Prop({ required: true })
  startTime: string; // e.g., "09:00 AM"

  @Prop({ required: true })
  endTime: string; // e.g., "06:00 PM"

  @Prop({ default: 15 })
  gracePeriod: number; // in minutes

  @Prop({ default: 60 })
  lunchDuration: number; // in minutes

  @Prop({ default: 15 })
  teaBreakDuration: number; // in minutes

  @Prop({ default: 3 })
  maxBreaks: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
