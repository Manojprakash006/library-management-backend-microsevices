import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LibraryConfig, LibraryConfigDocument, holidays } from '../entities/library-config.entity';

@Injectable()
export class HolidayCleanupService {
  constructor(
    @InjectModel(LibraryConfig.name)
    private libraryConfigModel: Model<LibraryConfigDocument>,
  ) {}

  @Cron('0 0 * * *')
  async resetExpiredHoliday() {
    const config = await this.libraryConfigModel.findOne();

    if (!config) return;

    if (
      config.holidayToDate &&
      new Date(config.holidayToDate) < new Date()
    ) {
      config.holidaysInfo = holidays.publicLeave;

      config.holidayFromDate = null;
      config.holidayToDate = null;
      config.isHolidayActive = false;

      await config.save();
    }
  }
}