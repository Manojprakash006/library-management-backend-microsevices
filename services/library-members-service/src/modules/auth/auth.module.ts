import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { User, UserSchema } from './entities/user.entity';
import { Staff, StaffSchema } from '../staff/entities/staff.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ActivityLogModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
