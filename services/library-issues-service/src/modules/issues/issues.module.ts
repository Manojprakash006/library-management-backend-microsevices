import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { IssuesController } from './controller/issues.controller';
import { IssuesService } from './service/issues.service';
import { IssueBook, IssueBookSchema } from './entities/issue-book.entity';
import { Book, BookSchema } from './shared/entities/book.entity';
import { DamageReportsModule } from '../damage-reports/damage-reports.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IssueBook.name, schema: IssueBookSchema }, 
      { name: Book.name, schema: BookSchema },]),
    HttpModule,
    DamageReportsModule,
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule { }
