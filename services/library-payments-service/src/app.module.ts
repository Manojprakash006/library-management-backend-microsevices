import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { FinesModule } from './modules/fines/fines.module';
import { RedisEmitterModule } from './modules/redis-emitter/redis-emitter.module';

@Module({
  imports: [
    ConfigModule,
 MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_payments', {
      dbName: process.env.MONGODB_DB || 'library_payments',
    }),    
    FinesModule,
    RedisEmitterModule,
  ],
})
export class AppModule {}
