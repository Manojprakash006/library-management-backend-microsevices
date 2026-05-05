import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactMessageDocument = ContactMessage & Document;

@Schema({ timestamps: true })
export class ContactMessage {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'unread' })
  status: string; // unread, read, replied

  @Prop()
  replyMessage: string;

  @Prop()
  repliedAt: Date;
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
