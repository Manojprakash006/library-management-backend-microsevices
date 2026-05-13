import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LibraryConfigDocument = LibraryConfig & Document;

export enum holidays {
  publicLeave = 'Closed on public holidays',
  maintenanceLeave = 'Closed for Maintenance',
  localHoliday = 'Closed on Local holidays',
  festivalHoliday = 'Closed on Festival holidays'
}

@Schema({ timestamps: true })
export class LibraryConfig {
  @Prop({ default: 'City Central Library' })
  libraryName: string;

  @Prop({ default: '123 Library Street, City Center, State - 600001, India' })
  address: string;

  @Prop({ default: '+91-44-1234-5678' })
  phone: string;

  @Prop({ default: '+91-44-1234-5679' })
  referencePhone: string;

  @Prop({ default: 'info@citycentrallibrary.org' })
  email: string;

  @Prop({ default: 'membership@citycentrallibrary.org' })
  membershipEmail: string;

  @Prop({ default: '09:00' })
  weekdaysOpen: string;

  @Prop({ default: '20:00' })
  weekdaysClose: string;

  @Prop({ default: '10:00' })
  weekendOpen: string;

  @Prop({ default: '17:00' })
  weekendClose: string;

  @Prop({ default: 'Monday - Friday' })
  weekdaysLabel: string;

  @Prop({ default: 'Saturday - Sunday' })
  weekendLabel: string;

  @Prop({ enum: holidays , default: holidays.publicLeave,  })
  holidaysInfo: string;

  @Prop({ default: null })
  holidayFromDate: Date;

  @Prop({ default: null })
  holidayToDate: Date;

  @Prop({ default: false })
  isHolidayActive: boolean;

  @Prop({ default: '' })
  googleMapsEmbed: string;

  @Prop({ default: 'Your privacy is important to us. We collect only necessary information to provide library services.' })
  privacyPolicy: string;

  @Prop({ default: 'By using our library services, you agree to follow our rules and regulations regarding book borrowing and facility usage.' })
  termsOfService: string;
}

export const LibraryConfigSchema = SchemaFactory.createForClass(LibraryConfig);
