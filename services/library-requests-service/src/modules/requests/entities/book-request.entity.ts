import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookRequestDocument = HydratedDocument<BookRequest>;

export enum RequestStatus {
  PENDING = 'PENDING',
  RENEW_PENDING = 'RENEW_PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum RequestType {
  TAKE_HOME = 'TAKE_HOME',
  RENEW = 'RENEW',
  READING_INSIDE_LIBRARY = 'READING_INSIDE_LIBRARY',
}

@Schema({ timestamps: true })
export class BookRequest {
  @Prop({ unique: true, trim: true, index: true, sparse: true })
  requestId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Member' })
  memberId: Types.ObjectId;

  @Prop({ type: String, enum: RequestType, default: RequestType.TAKE_HOME, required: true })
  requestType: RequestType

  @Prop({ required: false, default: null })
  renewDays: number;

  @Prop()
  issueId: string;

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
