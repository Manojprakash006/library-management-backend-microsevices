import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RenewalsController } from './controller/renewals.controller';
import { RenewalsService } from './service/renewals.service';
import { BookRenewal, BookRenewalSchema } from './entities/book-renewal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookRenewal.name, schema: BookRenewalSchema },
    ]),
  ],
  controllers: [RenewalsController],
  providers: [RenewalsService],
  exports: [RenewalsService],
})
export class RenewalsModule {}
