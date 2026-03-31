import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LibraryVisitDocument = LibraryVisit & Document;

@Schema({ timestamps: true })
export class LibraryVisit {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ required: true })
  timeIn: Date;

  @Prop()
  timeOut: Date;

  @Prop({ enum: ['reading', 'issue', 'return', 'other'], default: 'reading' })
  purpose: string;

  @Prop({ type: [String], default: [] })
  bookIds: string[];

  @Prop()
  notes: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const LibraryVisitSchema = SchemaFactory.createForClass(LibraryVisit);
