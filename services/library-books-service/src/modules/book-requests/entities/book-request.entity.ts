import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type BookRequestDocument = HydratedDocument<BookRequest>;

export enum BookRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class BookRequest {
  @Prop({ required: true, unique: true, trim: true })
  requestId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  requestDate: Date;

  @Prop({
    type: String,
    enum: BookRequestStatus,
    default: BookRequestStatus.PENDING,
  })
  status: BookRequestStatus;

  @Prop({ type: Number, default: 0, min: 0 })
  currentlyBorrowed: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalHistory: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'IssueBook' }] })
  activeBookIds: Types.ObjectId[];

  @Prop({ type: [String] })
  booklistBorrowed: string[];

  @Prop({ type: Date })
  processedDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  processedBy: Types.ObjectId;
}

export const BookRequestSchema = SchemaFactory.createForClass(BookRequest);

BookRequestSchema.index({ memberId: 1, status: 1 });
BookRequestSchema.index({ bookId: 1, status: 1 });
BookRequestSchema.index({ requestDate: -1 });
