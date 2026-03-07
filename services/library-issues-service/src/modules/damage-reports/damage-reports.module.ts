import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DamageReportsController } from './controller/damage-reports.controller';
import { DamageReportsService } from './service/damage-reports.service';
import { BookDamageReport, BookDamageReportSchema } from './entities/book-damage-report.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookDamageReport.name, schema: BookDamageReportSchema },
    ]),
  ],
  controllers: [DamageReportsController],
  providers: [DamageReportsService],
  exports: [DamageReportsService],
})
export class DamageReportsModule {}
