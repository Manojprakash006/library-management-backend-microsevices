import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BookCondition, BookStatus } from './book.entity';

export type BookCopyDocument = HydratedDocument<BookCopy>;

@Schema({ timestamps: true })
export class BookCopy {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true, index: true })
  bookId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, index: true })
  copyNumber: string; // Accession Number or Barcode

  @Prop({ type: String, enum: BookStatus, default: BookStatus.AVAILABLE })
  status: BookStatus;

  @Prop({ type: String, enum: BookCondition, default: BookCondition.GOOD })
  condition: BookCondition;

  @Prop({ trim: true })
  barcode?: string;

  @Prop({ type: String })
  addedBy?: string;
}

export const BookCopySchema = SchemaFactory.createForClass(BookCopy);

BookCopySchema.index({ bookId: 1, status: 1 });
