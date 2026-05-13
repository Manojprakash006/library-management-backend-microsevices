import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './controller/contact.controller';
import { ContactService } from './service/contact.service';
import { ContactMessage, ContactMessageSchema } from './entities/contact-message.entity';
import { LibraryConfig, LibraryConfigSchema } from './entities/library-config.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { HolidayCleanupService } from './service/holiday-cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: LibraryConfig.name, schema: LibraryConfigSchema }
    ]),
    NotificationsModule,
  ],
  controllers: [ContactController],
  providers: [ContactService, HolidayCleanupService],
  exports: [ContactService, HolidayCleanupService],
})
export class ContactModule {}
