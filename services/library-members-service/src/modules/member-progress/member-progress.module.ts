import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MemberProgressController } from './controller/member-progress.controller';
import { MemberProgressService } from './service/member-progress.service';
import { MemberDashboardModule } from '../member-dashboard/member-dashboard.module';

@Module({
  imports: [HttpModule, 
            MemberDashboardModule],
  controllers: [MemberProgressController],
  providers: [MemberProgressService]
})
export class MemberProgressModule {}
