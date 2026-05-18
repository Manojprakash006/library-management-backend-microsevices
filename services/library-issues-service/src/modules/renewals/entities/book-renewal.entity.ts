import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BookRenewalDocument = HydratedDocument<BookRenewal>;

export enum RenewalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class BookRenewal {
  @Prop({ required: true, unique: true, trim: true })
  renewalId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'IssueBook', required: true })
  issueId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  currentDueDate: Date;

  @Prop({ type: Date, required: true })
  newDueDate: Date;

  @Prop({
    type: String,
    enum: RenewalStatus,
    default: RenewalStatus.PENDING,
  })
  status: RenewalStatus;

  @Prop({ type: Date, default: Date.now })
  requestDate: Date;

  @Prop({ type: Date })
  processedDate: Date;
}

export const BookRenewalSchema = SchemaFactory.createForClass(BookRenewal);

BookRenewalSchema.index({ memberId: 1, status: 1 });
BookRenewalSchema.index({ issueId: 1 });
BookRenewalSchema.index({ requestDate: -1 });
