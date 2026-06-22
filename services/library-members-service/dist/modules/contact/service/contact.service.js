"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_message_entity_1 = require("../entities/contact-message.entity");
const library_config_entity_1 = require("../entities/library-config.entity");
const notifications_service_1 = require("../../notifications/service/notifications.service");
const email_service_1 = require("../../notifications/service/email.service");
const notifications_gateway_1 = require("../../notifications/gateway/notifications.gateway");
let ContactService = ContactService_1 = class ContactService {
    constructor(contactMessageModel, libraryConfigModel, notificationsService, emailService, notificationsGateway) {
        this.contactMessageModel = contactMessageModel;
        this.libraryConfigModel = libraryConfigModel;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
        this.notificationsGateway = notificationsGateway;
        this.logger = new common_1.Logger(ContactService_1.name);
    }
    async sendReply(id, replyMessage) {
        const message = await this.contactMessageModel.findById(id).exec();
        if (!message)
            throw new Error('Message not found');
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
        return this.contactMessageModel.findByIdAndUpdate(id, {
            status: 'replied',
            replyMessage,
            repliedAt: new Date()
        }, { new: true }).exec();
    }
    async createMessage(createDto) {
        try {
            const newMessage = new this.contactMessageModel(createDto);
            const savedMessage = await newMessage.save();
            await this.notificationsService.notifyStaff({
                title: 'New Contact Message',
                message: `From: ${createDto.name} (${createDto.email}). Subject: ${createDto.subject}`,
                type: 'CONTACT_MESSAGE'
            });
            await this.notificationsService.notifyAdmins({
                title: 'New Contact Message',
                message: `From: ${createDto.name} (${createDto.email}). Subject: ${createDto.subject}`,
                type: 'CONTACT_MESSAGE'
            });
            return savedMessage;
        }
        catch (error) {
            this.logger.error(`Failed to save contact message: ${error.message}`);
            throw error;
        }
    }
    async getAllMessages() {
        return this.contactMessageModel.find().sort({ createdAt: -1 }).exec();
    }
    async updateMessageStatus(id, status) {
        return this.contactMessageModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    async getLibraryConfig() {
        let config = await this.libraryConfigModel.findOne().exec();
        if (!config) {
            config = new this.libraryConfigModel({});
            await config.save();
        }
        if (config?.holidayToDate) {
            const today = new Date();
            if (today > config.holidayToDate) {
                config.isHolidayActive = false;
                config.holidaysInfo = 'Closed on public holidays';
                config.holidayFromDate = null;
                config.holidayToDate = null;
                await config.save();
            }
        }
        return config;
    }
    async updateLibraryConfig(updateData) {
        let config = await this.libraryConfigModel.findOne().exec();
        if (!config) {
            config = new this.libraryConfigModel(updateData);
        }
        else {
            Object.assign(config, updateData);
        }
        const updatedConfig = await config.save();
        this.notificationsGateway.emitPublicUpdate('library_info_updated', updatedConfig);
        return updatedConfig;
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_message_entity_1.ContactMessage.name)),
    __param(1, (0, mongoose_1.InjectModel)(library_config_entity_1.LibraryConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService,
        notifications_gateway_1.NotificationsGateway])
], ContactService);
//# sourceMappingURL=contact.service.js.map