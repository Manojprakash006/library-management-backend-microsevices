import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export type MemberDocument = HydratedDocument<Member>;

@Schema({ timestamps: true })
export class Member {
  @Prop({ unique: true, trim: true, index: true, sparse: true })
  memberId: string;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
  email: string;

  @Prop({ trim: true, minlength: 10, maxlength: 20, default: '' })
  phoneNumber: string;

  @Prop({ trim: true, maxlength: 500 })
  address: string;

  @Prop({ required: true, minlength: 6, maxlength: 100, select: false })
  password: string;

  @Prop({ default: Date.now })
  membershipDate: Date;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: 0 })
  booksHeld: number;

  @Prop({ default: 0 })
  booksAtHome: number;

  @Prop({ default: 0 })
  readingInsideLibrary: number;

  @Prop({ default: 0 })
  totalFines: number;

  @Prop({ default: false })
  hasActiveIssues: boolean;

  @Prop([{
    bookId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }])
  reviews: Array<{
    bookId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;

  @Prop([{
    bookId: { type: String, required: true },
    issueId: { type: String, required: true },
    bookTitle: { type: String },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    returnedAt: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
    fine: { type: Number, default: 0 },
  }])
  borrowingHistory: Array<{
    bookId: string;
    issueId: string;
    bookTitle?: string;
    borrowedAt: Date;
    dueDate?: Date;
    returnedAt?: Date;
    status: 'borrowed' | 'returned' | 'overdue';
    fine: number;
  }>;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre('save', async function (next) {
  if (!this.memberId) {
    const count = await (this.constructor as any).countDocuments();
    this.memberId = `MEM${count + 1}`;
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

MemberSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

MemberSchema.index({ email: 1, isActive: 1 });
