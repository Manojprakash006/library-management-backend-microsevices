import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema({ timestamps: true })
export class Config {
  @Prop({ default: 50 })
  maxRackCapacity: number;

  @Prop({ default: 10 })
  maxShelfCapacity: number;

  @Prop({ default: 'DEFAULT' })
  configKey: string; // To ensure we only have one config document
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
