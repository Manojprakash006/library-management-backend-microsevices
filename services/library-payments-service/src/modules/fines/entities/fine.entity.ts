import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FineDocument = Fine & Document;

export enum FineStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
}

@Schema({ timestamps: true })
export class Fine {
  @Prop({ unique: true, index: true, sparse: true })
  fineId: string;

  @Prop({ required: true, index: true })
  memberId: string;

  @Prop({ required: true, index: true })
  issueId: string;

  @Prop({ required: false })
  bookId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true, enum: FineStatus, default: FineStatus.UNPAID, index: true })
  status: FineStatus;

  @Prop({ required: false, enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @Prop({ required: false })
  paidAt?: Date;

  @Prop({ required: false })
  referenceId?: string;

  @Prop({ required: false })
  razorpayOrderId?: string;
}

export const FineSchema = SchemaFactory.createForClass(Fine);

FineSchema.pre('save', async function (next) {
  if (this.fineId) return next();
  
  const count = await (this.constructor as any).countDocuments();
  this.fineId = `FINE${count + 1}`;
  next();
});
