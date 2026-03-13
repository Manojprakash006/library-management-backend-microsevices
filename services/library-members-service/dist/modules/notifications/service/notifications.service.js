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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_entity_1 = require("../entities/notification.entity");
const email_service_1 = require("./email.service");
const notifications_gateway_1 = require("../gateway/notifications.gateway");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel, emailService, notificationsGateway) {
        this.notificationModel = notificationModel;
        this.emailService = emailService;
        this.notificationsGateway = notificationsGateway;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(createNotificationDto) {
        const { memberId, issueId, type, title, message, memberEmail, memberName } = createNotificationDto;
        const createdNotification = new this.notificationModel({
            memberId: new mongoose_2.Types.ObjectId(memberId),
            issueId: issueId ? new mongoose_2.Types.ObjectId(issueId) : undefined,
            type,
            title,
            message,
            isRead: false,
            sentAt: new Date(),
        });
        const savedNotification = await createdNotification.save();
        this.notificationsGateway.sendNotificationToUser(memberId, savedNotification);
        const unreadCount = await this.getUnreadCount(memberId);
        this.notificationsGateway.sendUnreadCount(memberId, unreadCount);
        if (memberEmail && memberName) {
            await this.sendEmailNotification(memberEmail, memberName, title, message, type);
        }
        return savedNotification;
    }
    async getUnreadCount(memberId) {
        return this.notificationModel.countDocuments({
            memberId: new mongoose_2.Types.ObjectId(memberId),
            isRead: false,
        }).exec();
    }
    async sendEmailNotification(email, name, title, message, type) {
        try {
            if (type === 'DUE_REMINDER') {
                await this.emailService.sendEmail(email, title, message);
            }
            else if (type === 'OVERDUE') {
                await this.emailService.sendEmail(email, title, message);
            }
            else {
                await this.emailService.sendEmail(email, title, message);
            }
            this.logger.log(`Email notification sent to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${email}: ${error.message}`);
        }
    }
    async findAll() {
        return this.notificationModel.find().exec();
    }
    async findByMember(memberId) {
        return this.notificationModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId) })
            .populate('issueId', 'bookId dueDate')
            .sort('-createdAt')
            .limit(50)
            .exec();
    }
    async findUnreadByMember(memberId) {
        return this.notificationModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId), isRead: false })
            .populate('issueId', 'bookId dueDate')
            .sort('-createdAt')
            .exec();
    }
    async findOne(id) {
        const notification = await this.notificationModel
            .findById(id)
            .populate('issueId', 'bookId dueDate')
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAsRead(id, memberId) {
        const notification = await this.notificationModel
            .findOneAndUpdate({ _id: id, memberId: new mongoose_2.Types.ObjectId(memberId) }, { isRead: true }, { new: true })
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        const unreadCount = await this.getUnreadCount(memberId);
        this.notificationsGateway.sendUnreadCount(memberId, unreadCount);
        this.notificationsGateway.sendNotificationToUser(memberId, { type: 'notificationRead', notificationId: id });
        return notification;
    }
    async markAllAsRead(memberId) {
        await this.notificationModel
            .updateMany({ memberId: new mongoose_2.Types.ObjectId(memberId), isRead: false }, { isRead: true })
            .exec();
        this.notificationsGateway.sendUnreadCount(memberId, 0);
        this.notificationsGateway.sendNotificationToUser(memberId, { type: 'allNotificationsRead' });
    }
    async remove(id) {
        const result = await this.notificationModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Notification not found');
        }
    }
    async sendDueDateReminders() {
        this.logger.log('Sending due date reminders');
        return { message: 'Due date reminders sent successfully', count: 0 };
    }
    async sendOverdueNotifications() {
        this.logger.log('Sending overdue notifications');
        return { message: 'Overdue notifications sent successfully', count: 0 };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_entity_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map