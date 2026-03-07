import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogsController } from './controller/activity-logs.controller';
import { ActivityLogsService } from './service/activity-logs.service';
import { ActivityLog, ActivityLogSchema } from './entities/activity-log.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
