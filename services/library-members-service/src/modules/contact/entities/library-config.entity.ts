import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LibraryConfigDocument = LibraryConfig & Document;

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

  @Prop({ default: 'Monday - Friday: 9:00 AM - 8:00 PM' })
  weekdaysHours: string;

  @Prop({ default: 'Saturday - Sunday: 10:00 AM - 6:00 PM' })
  weekendHours: string;

  @Prop({ default: 'Closed on public holidays' })
  holidaysInfo: string;

  @Prop({ default: '' })
  googleMapsEmbed: string;

  @Prop({ default: 'Your privacy is important to us. We collect only necessary information to provide library services.' })
  privacyPolicy: string;

  @Prop({ default: 'By using our library services, you agree to follow our rules and regulations regarding book borrowing and facility usage.' })
  termsOfService: string;
}

export const LibraryConfigSchema = SchemaFactory.createForClass(LibraryConfig);
