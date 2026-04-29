import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PushSubscription extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Object, required: true })
  subscription: any;

  @Prop()
  deviceInfo?: string;
}

export const PushSubscriptionSchema = SchemaFactory.createForClass(PushSubscription);
