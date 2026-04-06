import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IssuesController } from './controller/issues.controller';
import { IssuesService } from './service/issues.service';
import { IssueBook, IssueBookSchema } from './entities/issue-book.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IssueBook.name, schema: IssueBookSchema }]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'PAYMENTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'library.payments',
          protoPath: join(__dirname, '../../proto/payments.proto'),
          url: process.env.PAYMENTS_GRPC_URL || '0.0.0.0:5005',
        },
      },
    ]),
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule { }
