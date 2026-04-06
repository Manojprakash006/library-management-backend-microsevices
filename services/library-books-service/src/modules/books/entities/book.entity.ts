import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

export enum BookType {
  ISSUE_BOOK = 'Issue Book',
  REFERENCE_BOOK = 'Reference Book',
}

export enum BookCondition {
  NEW = 'New',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  DAMAGED = 'Damaged',
}

export enum BookStatus {
  AVAILABLE = 'available',
  ISSUED = 'issued',
  MAINTENANCE = 'maintenance',
  LOST = 'lost',
  DAMAGED = 'damaged',
}

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, unique: true, trim: true, index: true })
  bookId: string;

  @Prop({ trim: true, sparse: true })
  isbn: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 500, index: true })
  title: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 200, index: true })
  author: string;

  @Prop({ trim: true, maxlength: 200 })
  publisher: string;

  @Prop({ min: 1000, max: new Date().getFullYear() + 1 })
  publishYear: number;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ trim: true })
  edition: string;

  @Prop({ trim: true })
  language: string;

  @Prop({ min: 1 })
  pages: number;

  @Prop({ min: 0 })
  price: number;

  @Prop({ required: true, trim: true, index: true })
  rackNumber: string;

  @Prop({ trim: true })
  shelfNumber: string;

  @Prop({ type: String, enum: BookType, default: BookType.ISSUE_BOOK })
  bookType: BookType;

  @Prop({ type: String, enum: BookCondition, default: BookCondition.GOOD })
  condition: BookCondition;

  @Prop({ type: String, enum: BookStatus, default: BookStatus.AVAILABLE })
  status: BookStatus;

  @Prop({ trim: true, maxlength: 2000 })
  description: string;

  @Prop({ default: 1, min: 0 })
  quantity: number;

  @Prop({ trim: true })
  coverUrl: string;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ type: String })
  createdBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({ title: 'text', author: 'text', category: 'text' });
BookSchema.index({ category: 1, rackNumber: 1 });
