import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffDashboardController } from './controller/staff-dashboard.controller';
import { StaffDashboardService } from './service/staff-dashboard.service';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { Staff, StaffSchema } from '../staff/entities/staff.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [StaffDashboardController],
  providers: [StaffDashboardService],
  exports: [StaffDashboardService],
})
export class StaffDashboardModule {}
