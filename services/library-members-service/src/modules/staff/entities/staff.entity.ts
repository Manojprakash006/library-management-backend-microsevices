import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type StaffDocument = HydratedDocument<Staff>;

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum StaffStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Schema({ timestamps: true })
export class Staff {
  @Prop({ unique: true, trim: true, index: true, sparse: true })
  staffId: string;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100, index: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
  email: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 20 })
  phone: string;

  @Prop({ required: true, minlength: 6, maxlength: 100, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  shift: string;

  @Prop({ type: String, enum: StaffStatus, default: StaffStatus.ACTIVE, index: true })
  status: StaffStatus;

  @Prop({ type: String, enum: StaffRole, default: StaffRole.STAFF, index: true })
  role: StaffRole;

  @Prop({ trim: true, maxlength: 200 })
  qualification: string;

  @Prop({ trim: true, maxlength: 500 })
  address: string;

  @Prop({ trim: true, minlength: 10, maxlength: 20 })
  emergencyContact: string;

  @Prop({ trim: true, default: 'General' })
  department: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: "" })
  profileImage: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.pre('save', async function (next: () => void) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

StaffSchema.pre('save', async function (next: () => void) {
  if (this.staffId) return next();
  
  const count = await (this.constructor as any).countDocuments();
  this.staffId = `STF${count + 1}`;
  next();
});

StaffSchema.index({ email: 1, isActive: 1 });
StaffSchema.index({ department: 1, status: 1 });
