import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { IssuesModule } from './modules/issues/issues.module';
import { RenewalsModule } from './modules/renewals/renewals.module';
import { DamageReportsModule } from './modules/damage-reports/damage-reports.module';
import { RedisEmitterModule } from './modules/redis-emitter/redis-emitter.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_members', {
      dbName: process.env.MONGODB_DB || 'library_members',
    }),
    IssuesModule,
    RenewalsModule,
    DamageReportsModule,
    RedisEmitterModule,
  ],
})
export class AppModule { }
