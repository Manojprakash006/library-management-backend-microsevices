import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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

@Module({
  imports: [
    ConfigModule,
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
  ],
})
export class AppModule { }
