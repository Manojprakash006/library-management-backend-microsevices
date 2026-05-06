import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { MembersModule } from './modules/members/members.module';
import { StaffModule } from './modules/staff/staff.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { MemberAuthModule } from './modules/member-auth/member-auth.module';
import { UsersModule } from './modules/users/users.module';
import { MemberHistoryModule } from './modules/member-history/member-history.module';
import { MemberDashboardModule } from './modules/member-dashboard/member-dashboard.module';
import { StaffDashboardModule } from './modules/staff-dashboard/staff-dashboard.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { AdminModule } from './modules/admin/admin.module';
import { LibraryVisitsModule } from './modules/library-visits/library-visits.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { RedisEmitterModule } from './modules/redis-emitter/redis-emitter.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_members', {
      dbName: process.env.MONGODB_DB || 'library_members',
    }),
    MembersModule,
    StaffModule,
    NotificationsModule,
    AuthModule,
    MemberAuthModule,
    UsersModule,
    MemberHistoryModule,
    MemberDashboardModule,
    StaffDashboardModule,
    ActivityLogModule,
    AdminModule,
    LibraryVisitsModule,
    FavouriteModule,
    RedisEmitterModule,
    ContactModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
