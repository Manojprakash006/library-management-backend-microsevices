import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberHistoryController } from './controller/member-history.controller';
import { MemberHistoryService } from './service/member-history.service';
import { Member, MemberSchema } from '../members/entities/member.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  controllers: [MemberHistoryController],
  providers: [MemberHistoryService],
  exports: [MemberHistoryService],
})
export class MemberHistoryModule {}
