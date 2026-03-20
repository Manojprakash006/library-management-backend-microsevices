import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ required: true, index: true })
  adminId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Create indexes for efficient querying
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ adminId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, action: 1 });
