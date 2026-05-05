import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage, ContactMessageDocument } from '../entities/contact-message.entity';
import { LibraryConfig, LibraryConfigDocument } from '../entities/library-config.entity';
import { CreateContactMessageDto } from '../dto/contact-message.dto';
import { NotificationsService } from '../../notifications/service/notifications.service';
import { EmailService } from '../../notifications/service/email.service';
import { NotificationsGateway } from '../../notifications/gateway/notifications.gateway';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(ContactMessage.name) private contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(LibraryConfig.name) private libraryConfigModel: Model<LibraryConfigDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async sendReply(id: string, replyMessage: string) {
    const message = await this.contactMessageModel.findById(id).exec();
    if (!message) throw new Error('Message not found');

    const subject = `Re: ${message.subject}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Library Response</h2>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #333;">
          <p>Hi <strong>${message.name}</strong>,</p>
          <p>Thank you for contacting us. Regarding your inquiry about "${message.subject}", here is our response:</p>
          <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; font-style: italic;">
            ${replyMessage}
          </div>
          <p>If you have any further questions, feel free to reply to this email or visit our library.</p>
          <p style="margin-top: 30px; border-top: 1px solid #eee; pt-20px; color: #666; font-size: 13px;">
            Best Regards,<br>
            <strong>Library Management Team</strong>
          </p>
        </div>
      </div>
    `;

    await this.emailService.sendEmail(message.email, subject, html);
    
    // Update status and save reply details in DB
    return this.contactMessageModel.findByIdAndUpdate(
      id, 
      { 
        status: 'replied',
        replyMessage,
        repliedAt: new Date()
      }, 
      { new: true }
    ).exec();
  }

  async createMessage(createDto: CreateContactMessageDto) {
    try {
      const newMessage = new this.contactMessageModel(createDto);
      const savedMessage = await newMessage.save();

      // Notify Staff about new contact message
      await this.notificationsService.notifyStaff({
        title: 'New Contact Message',
        message: `From: ${createDto.name} (${createDto.email}). Subject: ${createDto.subject}`,
        type: 'CONTACT_MESSAGE'
      });

      return savedMessage;
    } catch (error) {
      this.logger.error(`Failed to save contact message: ${error.message}`);
      throw error;
    }
  }

  async getAllMessages() {
    return this.contactMessageModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateMessageStatus(id: string, status: string) {
    return this.contactMessageModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async getLibraryConfig() {
    let config = await this.libraryConfigModel.findOne().exec();
    if (!config) {
      config = new this.libraryConfigModel({});
      await config.save();
    }
    return config;
  }

  async updateLibraryConfig(updateData: Partial<LibraryConfig>) {
    let config = await this.libraryConfigModel.findOne().exec();
    if (!config) {
      config = new this.libraryConfigModel(updateData);
    } else {
      Object.assign(config, updateData);
    }
    const updatedConfig = await config.save();
    this.notificationsGateway.emitPublicUpdate('library_info_updated', updatedConfig);
    return updatedConfig;
  }
}
