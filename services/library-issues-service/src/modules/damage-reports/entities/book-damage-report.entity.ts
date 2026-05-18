import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BookDamageReportDocument = HydratedDocument<BookDamageReport>;

export enum DamageReportReason {
  LOST = 'Lost',
  DAMAGED = 'Damaged',
}

export enum DamageReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class BookDamageReport {
  @Prop({ required: true, unique: true, trim: true })
  reportId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'IssueBook', required: true })
  issueId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  bookId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: DamageReportReason, required: true })
  reason: DamageReportReason;

  @Prop({ type: Number, required: true, min: 0 })
  bookAmount: number;

  @Prop({ type: Number, required: true, min: 0 })
  fineAmount: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;

  @Prop({
    type: String,
    enum: DamageReportStatus,
    default: DamageReportStatus.PENDING,
  })
  status: DamageReportStatus;

  @Prop({ type: Date, default: Date.now })
  reportDate: Date;

  @Prop({ type: Date })
  processedDate: Date;
}

export const BookDamageReportSchema = SchemaFactory.createForClass(BookDamageReport);

BookDamageReportSchema.index({ memberId: 1, status: 1 });
BookDamageReportSchema.index({ bookId: 1, status: 1 });
BookDamageReportSchema.index({ reportDate: -1 });
