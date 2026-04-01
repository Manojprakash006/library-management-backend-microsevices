import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { StaffDashboardController } from './controller/staff-dashboard.controller';
import { StaffDashboardService } from './service/staff-dashboard.service';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { Staff, StaffSchema } from '../staff/entities/staff.entity';
import { LibraryVisit, LibraryVisitSchema } from '../library-visits/entities/library-visit.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: LibraryVisit.name, schema: LibraryVisitSchema },
    ]),
    HttpModule,
    ActivityLogModule,
  ],
  controllers: [StaffDashboardController],
  providers: [StaffDashboardService],
  exports: [StaffDashboardService],
})
export class StaffDashboardModule {}
