import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './controller/contact.controller';
import { ContactService } from './service/contact.service';
import { ContactMessage, ContactMessageSchema } from './entities/contact-message.entity';
import { LibraryConfig, LibraryConfigSchema } from './entities/library-config.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: LibraryConfig.name, schema: LibraryConfigSchema }
    ]),
    NotificationsModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
