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
  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true })
  issueId: string;

  @Prop({ required: false })
  bookId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true, enum: FineStatus, default: FineStatus.UNPAID })
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
