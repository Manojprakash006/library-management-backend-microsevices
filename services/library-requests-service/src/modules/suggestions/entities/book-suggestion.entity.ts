import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookSuggestionDocument = HydratedDocument<BookSuggestion>;

export enum SuggestionStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PROCURED = 'Procured', // When the book is actually added to library
}

@Schema({ timestamps: true })
export class BookSuggestion {
  @Prop({ unique: true, trim: true, index: true, sparse: true })
  suggestionId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Member' })
  memberId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ trim: true })
  category: string;

  @Prop({ type: String, enum: SuggestionStatus, default: SuggestionStatus.PENDING })
  status: SuggestionStatus;

  @Prop({ trim: true })
  remarks: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  loggedBy: Types.ObjectId; // If logged by staff, else null (if member logged it)
}

export const BookSuggestionSchema = SchemaFactory.createForClass(BookSuggestion);

BookSuggestionSchema.pre('save', async function (next: () => void) {
  if (this.suggestionId) return next();

  const count = await (this.constructor as any).countDocuments();
  this.suggestionId = `SUG${count + 1}`;
  next();
});

BookSuggestionSchema.index({ memberId: 1, status: 1 });
BookSuggestionSchema.index({ status: 1 });
