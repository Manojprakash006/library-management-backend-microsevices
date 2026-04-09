import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IssueBookDocument = HydratedDocument<IssueBook>;

export enum IssueType {
  READING_INSIDE_LIBRARY = 'Reading Inside Library',
  TAKING_HOME = 'Taking Home',
}

export enum IssueStatus {
  ACTIVE = 'Active',
  OVERDUE = 'Overdue',
  RETURNED = 'Returned',
}

@Schema({ timestamps: true })
export class IssueBook {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Member' })
  memberId: Types.ObjectId;

  @Prop({ type: String, enum: IssueType, required: true })
  issueType: IssueType;

  @Prop({ min: 1, required: false })
  numberOfDays: number;

  @Prop({ default: Date.now })
  issueDate: Date;

  @Prop({ required: false })
  dueDate: Date;

  @Prop()
  returnDate: Date;

  @Prop({ type: String, enum: IssueStatus, default: IssueStatus.ACTIVE })
  status: IssueStatus;

  @Prop({ default: 0, min: 0 })
  daysOverdue: number;

  @Prop({ default: 0, min: 0 })
  fine: number;

  @Prop({ default: 10, min: 0 })
  finePerDay: number;

  @Prop({ default: 0 })
  renewCount: number;
}

export const IssueBookSchema = SchemaFactory.createForClass(IssueBook);

IssueBookSchema.index({ memberId: 1, status: 1 });
IssueBookSchema.index({ bookId: 1, status: 1 });
IssueBookSchema.index({ dueDate: 1, status: 1 });
IssueBookSchema.index({ issueDate: -1 });
