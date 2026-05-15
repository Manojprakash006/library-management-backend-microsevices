import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemConfigDocument = SystemConfig & Document;

@Schema({ timestamps: true })
export class SystemConfig {
  @Prop({ default: 'DEFAULT' })
  configKey: string;

  @Prop({ default: '09:00 AM' })
  shiftStartTime: string;

  @Prop({ default: '06:00 PM' })
  shiftEndTime: string;

  @Prop({ default: 15 }) // in minutes
  gracePeriod: number;

  @Prop({ default: true })
  autoAbsentEnabled: boolean;
}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig);
