import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookRequestDocument = HydratedDocument<BookRequest>;

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

@Schema({ timestamps: true })
export class BookRequest {
  @Prop({ unique: true, trim: true, index: true, sparse: true })
  requestId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Member' })
  memberId: Types.ObjectId;

  @Prop({ default: Date.now })
  requestDate: Date;

  @Prop({ type: String, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop({ default: 0, min: 0 })
  currentlyBorrowed: number;

  @Prop({ default: 0, min: 0 })
  totalHistory: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'IssueBook' }] })
  activeBookIds: Types.ObjectId[];

  @Prop({ type: [String] })
  booklistBorrowed: string[];

  @Prop()
  processedDate: Date;
}

export const BookRequestSchema = SchemaFactory.createForClass(BookRequest);

BookRequestSchema.pre('save', async function (next: () => void) {
  if (this.requestId) return next();
  
  const count = await (this.constructor as any).countDocuments();
  this.requestId = `REQ${count + 1}`;
  next();
});

BookRequestSchema.index({ memberId: 1, status: 1 });
BookRequestSchema.index({ bookId: 1, status: 1 });
BookRequestSchema.index({ requestDate: -1 });
