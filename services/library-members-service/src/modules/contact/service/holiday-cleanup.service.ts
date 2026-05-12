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

  @Cron('0 0 * * *', { timeZone: 'Asia/kolkata'})
  async resetExpiredHoliday() {
    console.log('Cron running...');

    const config = await this.libraryConfigModel.findOne();

    if (!config) {
      console.log('No config found');
      return;
    }

      const today = new Date();
      today.setHours(0,0,0,0);

      const toDate = new Date(config.holidayToDate);
      toDate.setHours(0,0,0,0);

      if (toDate < today) {
      console.log('Holiday expired, updating...');

      config.holidaysInfo = holidays.publicLeave;
      config.holidayFromDate = null;
      config.holidayToDate = null;
      config.isHolidayActive = false;

      await config.save();

      console.log('DB updated');
    } else {
      console.log('No expiry yet');
    }
  }
}