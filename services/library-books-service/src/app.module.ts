import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { BooksModule } from './modules/books/books.module';
import { BookRequestsModule } from './modules/book-requests/book-requests.module';
import { RacksModule } from './modules/racks/racks.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MemberBooksModule } from './modules/member-books/member-books.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadModule } from './modules/upload/upload.module';
import { UtilModule } from './modules/util/util.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_members', {
      dbName: process.env.MONGODB_DB || 'library_members',
    }),
    BooksModule,
    BookRequestsModule,
    RacksModule,
    ReportsModule,
    MemberBooksModule,
    DashboardModule,
    UploadModule,
    UtilModule,
  ],
})
export class AppModule { }
