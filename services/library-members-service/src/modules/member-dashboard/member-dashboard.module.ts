import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberDashboardController } from './controller/member-dashboard.controller';
import { MemberDashboardService } from './service/member-dashboard.service';
import { Member, MemberSchema } from '../members/entities/member.entity';
import { BookRequest, BookRequestSchema } from './shared/book-request.entity';
import { IssueBook, IssueBookSchema } from './shared/issue-book.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }, { name: IssueBook.name, schema: IssueBookSchema },
      { name: BookRequest.name, schema: BookRequestSchema }]),
  ],
  controllers: [MemberDashboardController],
  providers: [MemberDashboardService],
  exports: [MemberDashboardService],
})
export class MemberDashboardModule {}
