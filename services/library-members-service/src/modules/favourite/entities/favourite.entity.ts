import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FavouriteDocument = Favourite & Document;

@Schema({ timestamps: true })
export class Favourite {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);