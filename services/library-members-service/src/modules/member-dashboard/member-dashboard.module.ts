import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberDashboardController } from './controller/member-dashboard.controller';
import { MemberDashboardService } from './service/member-dashboard.service';
import { Member, MemberSchema } from '../members/entities/member.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  controllers: [MemberDashboardController],
  providers: [MemberDashboardService],
  exports: [MemberDashboardService],
})
export class MemberDashboardModule {}
