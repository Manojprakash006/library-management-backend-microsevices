import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { EmailService } from './service/email.service';
import { Notification, NotificationSchema } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, EmailService],
  exports: [NotificationsService, NotificationsGateway, EmailService],
})
export class NotificationsModule {}
