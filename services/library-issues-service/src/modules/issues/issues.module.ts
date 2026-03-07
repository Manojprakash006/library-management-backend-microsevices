import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssuesController } from './controller/issues.controller';
import { IssuesService } from './service/issues.service';
import { IssueBook, IssueBookSchema } from './entities/issue-book.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: IssueBook.name, schema: IssueBookSchema }])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
