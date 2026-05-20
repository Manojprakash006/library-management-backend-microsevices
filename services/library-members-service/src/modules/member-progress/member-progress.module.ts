import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MemberProgressController } from './controller/member-progress.controller';
import { MemberProgressService } from './service/member-progress.service';

@Module({
  imports: [HttpModule],
  controllers: [MemberProgressController],
  providers: [MemberProgressService]
})
export class MemberProgressModule {}
