import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { EmailService } from './service/email.service';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { User, UserSchema } from '../auth/entities/user.entity';
    
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Member.name, schema: MemberSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],   
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, EmailService],
  exports: [NotificationsService, NotificationsGateway, EmailService],
})
export class NotificationsModule {}
