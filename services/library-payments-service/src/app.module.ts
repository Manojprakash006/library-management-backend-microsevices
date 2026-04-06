import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { FinesModule } from './modules/fines/fines.module';

@Module({
  imports: [
    ConfigModule,
 MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_payments', {
      dbName: process.env.MONGODB_DB || 'library_payments',
    }),    
    FinesModule,
  ],
})
export class AppModule {}
