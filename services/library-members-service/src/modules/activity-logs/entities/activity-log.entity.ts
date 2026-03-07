import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ required: true, trim: true })
  action: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book' })
  bookId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member' })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  performedBy: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ memberId: 1, timestamp: -1 });
ActivityLogSchema.index({ bookId: 1, timestamp: -1 });
ActivityLogSchema.index({ timestamp: -1 });
