import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { min } from 'class-validator';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema({ timestamps: true })
export class Config {
  @Prop({ default: 50, min: 50 })
  maxRackCapacity: number;

  @Prop({ default: 10, min: 10 })
  maxShelfCapacity: number;

  @Prop({ default: 'DEFAULT' })
  configKey: string; // To ensure we only have one document

  @Prop({ default: 10 })
  overdueFinePerDay: number;

  @Prop({ default: 50 })
  damagedFinePercent: number;

  @Prop({ default: 100 })
  lostFinePercent: number;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
