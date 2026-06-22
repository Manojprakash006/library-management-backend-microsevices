import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { EmailService } from './service/email.service';
import { RedisSubscriberService } from './service/redis-subscriber.service';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { User, UserSchema } from '../auth/entities/user.entity';
import { WebPushService } from './service/web-push.service';
import { PushSubscription, PushSubscriptionSchema } from './schema/push-subscription.schema';
import { LibraryConfig, LibraryConfigSchema } from '../contact/entities/library-config.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Member.name, schema: MemberSchema },
      { name: User.name, schema: UserSchema },
      { name: PushSubscription.name, schema: PushSubscriptionSchema },
      { name: LibraryConfig.name, schema: LibraryConfigSchema },
    ]),
  ],   
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, EmailService, RedisSubscriberService, WebPushService],
  exports: [NotificationsService, NotificationsGateway, EmailService],
})
export class NotificationsModule {}
