import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MemberAuthController } from './controller/member-auth.controller';
import { MemberAuthService } from './service/member-auth.service';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '24h' },
    }),
    NotificationsModule,
  ],
  controllers: [MemberAuthController],
  providers: [MemberAuthService],
  exports: [MemberAuthService],
})
export class MemberAuthModule {}
