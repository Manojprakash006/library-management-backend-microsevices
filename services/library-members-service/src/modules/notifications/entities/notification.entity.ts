import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  DUE_REMINDER = 'DUE_REMINDER',
  OVERDUE = 'OVERDUE',
  RETURN_CONFIRMATION = 'RETURN_CONFIRMATION',
  REQUEST_APPROVED = 'REQUEST_APPROVED',
  REQUEST_REJECTED = 'REQUEST_REJECTED',
  NEW_BOOK_REQUEST = 'NEW_BOOK_REQUEST',
  NEW_BOOK_ADDED = 'NEW_BOOK_ADDED',
  BOOK_ISSUED = 'BOOK_ISSUED',
  BOOK_RETURNED = 'BOOK_RETURNED',
  VISITOR_IN = 'VISITOR_IN',
  VISITOR_OUT = 'VISITOR_OUT',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  FINE_ADDED = 'FINE_ADDED',
  CONTACT_MESSAGE = 'CONTACT_MESSAGE',
  SUGGESTION_APPROVED = 'SUGGESTION_APPROVED',
  SUGGESTION_REJECTED = 'SUGGESTION_REJECTED',
  SUGGESTION_PROCURED = 'SUGGESTION_PROCURED',
  GENERAL = 'GENERAL',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'IssueBook' })
  issueId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: Date.now })
  sentAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ memberId: 1, isRead: 1 });
NotificationSchema.index({ memberId: 1, sentAt: -1 });
NotificationSchema.index({ type: 1 });

NotificationSchema.virtual('read').get(function() {
  return this.isRead;
});
NotificationSchema.set('toJSON', { virtuals: true });
NotificationSchema.set('toObject', { virtuals: true });
