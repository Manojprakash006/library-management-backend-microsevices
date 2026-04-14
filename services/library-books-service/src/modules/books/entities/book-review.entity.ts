import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookReviewDocument = HydratedDocument<BookReview>;

export enum ReviewStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

@Schema({ timestamps: true })
export class BookReview {
  @Prop({ type: Types.ObjectId, ref: 'Book' , required: true, index: true })
  bookId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  memberName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true, maxlength: 200 })
  reviewTitle: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 2000 })
  review: string;

  @Prop({ default: false })
  recommended: boolean;

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.PUBLISHED })
  status: ReviewStatus;

  @Prop({ default: Date.now })
  reviewDate: Date;

  @Prop({ type: [String], default: [] })
  likedBy: string[];

  @Prop({ default: 0})
  likeCount: number;
}

export const BookReviewSchema = SchemaFactory.createForClass(BookReview);

BookReviewSchema.index({ bookId: 1, memberId: 1 }, { unique: true });
BookReviewSchema.index({ memberId: 1, reviewDate: -1 });
BookReviewSchema.index({ bookId: 1, status: 1 });
