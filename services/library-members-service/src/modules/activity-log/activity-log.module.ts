import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogController } from './controller/activity-log.controller';
import { ActivityLogService } from './service/activity-log.service';
import { ActivityLog, ActivityLogSchema } from './entities/activity-log.entity';
import { Staff, StaffSchema } from '../staff/entities/staff.entity';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { User, UserSchema } from '../auth/entities/user.entity';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Member.name, schema: MemberSchema },
      { name: User.name, schema: UserSchema },
    ]),


  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
