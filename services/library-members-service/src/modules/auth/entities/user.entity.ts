import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User> & {
  matchPassword(enteredPassword: string): Promise<boolean>;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, })
  email: string;

  @Prop({ trim: true, maxlength: 500 })
  address: string;

  @Prop({ trim: true, maxlength: 10 })
  phone: string;

  @Prop({ required: true, minlength: 6, maxlength: 100, select: false })
  password: string;

  @Prop({ type: String, enum: ['admin', 'staff', 'member'], default: 'member' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, role: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};
