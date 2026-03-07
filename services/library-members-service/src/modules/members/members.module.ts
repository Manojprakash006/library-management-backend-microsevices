import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './controller/members.controller';
import { MembersService } from './service/members.service';
import { Member, MemberSchema } from './entities/member.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }])],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
