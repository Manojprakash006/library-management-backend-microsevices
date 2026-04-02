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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const schedule_1 = require("@nestjs/schedule");
const notification_entity_1 = require("../entities/notification.entity");
const email_service_1 = require("./email.service");
const notifications_gateway_1 = require("../gateway/notifications.gateway");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel, emailService, notificationsGateway, httpService) {
        this.notificationModel = notificationModel;
        this.emailService = emailService;
        this.notificationsGateway = notificationsGateway;
        this.httpService = httpService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(createNotificationDto) {
        let { memberId, issueId, type, title, message, memberEmail, memberName } = createNotificationDto;
        if (!memberEmail || !memberName) {
            try {
                const MemberSchema = this.notificationModel.db.model('Member');
                const member = await MemberSchema.findById(memberId).exec();
                if (member) {
                    memberEmail = memberEmail || member.email;
                    memberName = memberName || member.name;
                }
                else {
                    const UserSchema = this.notificationModel.db.model('User');
                    const user = await UserSchema.findById(memberId).exec();
                    if (user) {
                        memberEmail = memberEmail || user.email;
                        memberName = memberName || user.name;
                    }
                }
            }
            catch (err) {
                this.logger.error(`Could not fetch user/member details for notification: ${err.message}`);
            }
        }
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
        this.notificationsGateway.sendNotificationToUser(memberId.toString(), savedNotification);
        const unreadCount = await this.getUnreadCount(memberId.toString());
        this.notificationsGateway.sendUnreadCount(memberId.toString(), unreadCount);
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
    async notifyAdmins(payload) {
        try {
            const UserSchema = this.notificationModel.db.model('User');
            const admins = await UserSchema.find({ role: 'admin' }).exec();
            for (const admin of admins) {
                await this.create({
                    memberId: admin._id.toString(),
                    title: payload.title,
                    message: payload.message,
                    type: payload.type,
                    issueId: payload.issueId,
                    memberEmail: admin.email,
                    memberName: admin.name
                });
            }
            this.logger.log(`Notified ${admins.length} admins about: ${payload.title}`);
        }
        catch (err) {
            this.logger.error(`Failed to notify admins: ${err.message}`);
        }
    }
    async sendEmailNotification(email, name, title, message, type) {
        try {
            let color = '#4f46e5';
            let icon = '🔔';
            if (type.includes('APPROVE') || type.includes('ADDED') || type.includes('ISSUE')) {
                color = '#10b981';
                icon = '✅';
            }
            if (type.includes('REJECT') || type.includes('OVERDUE')) {
                color = '#ef4444';
                icon = '⚠️';
            }
            if (type.includes('DUE')) {
                color = '#f59e0b';
                icon = '⏳';
            }
            const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9fa; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 30px; border-top: 5px solid ${color}; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #333; margin-top: 0; font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            ${icon} ${title}
          </h2>
          <p style="font-size: 16px; color: #555; leading-trim: 1.5; line-height: 1.6;">
            Hi <strong>${name}</strong>,
          </p>
          <div style="background-color: #f4f6fc; padding: 15px 20px; border-radius: 6px; border-left: 4px solid ${color}; margin: 20px 0; font-size: 16px; color: #444; line-height: 1.5;">
            ${message}
          </div>
          <p style="font-size: 14px; color: #777; margin-top: 30px;">
            If you have any questions, feel free to reply to this email or contact the librarian.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0 15px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} Modern Library Management System. All rights reserved.
          </p>
        </div>
      </div>
      `;
            await this.emailService.sendEmail(email, title, htmlTemplate);
            this.logger.log(`Email styled notification sent to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send styled email to ${email}: ${error.message}`);
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
        this.logger.log('Executing automated Due Date Reminders cron job...');
        let count = 0;
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues`));
            const allIssues = response.data?.data || [];
            const today = new Date();
            const dueIssues = allIssues.filter((issue) => {
                if (issue.status !== 'Active' || !issue.dueDate)
                    return false;
                const due = new Date(issue.dueDate);
                const diffTime = due.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 1;
            });
            for (const issue of dueIssues) {
                await this.create({
                    memberId: issue.memberId,
                    issueId: issue._id,
                    type: 'DUE_REMINDER',
                    title: 'Book Due Reminder',
                    message: `Friendly reminder: Your borrowed book (ID: ${issue.bookId}) is due soon on ${new Date(issue.dueDate).toLocaleDateString()}. Please return it to avoid fines.`,
                });
                count++;
            }
            this.logger.log(`Sent ${count} due date reminders.`);
        }
        catch (error) {
            this.logger.error(`Automated due date reminder failed: ${error.message}`);
        }
        return { message: 'Due date reminders processed successfully', count };
    }
    async sendOverdueNotifications() {
        this.logger.log('Executing automated Overdue Notifications cron job...');
        let count = 0;
        try {
            const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/overdue`));
            const overdueIssues = response.data?.data || [];
            for (const issue of overdueIssues) {
                await this.create({
                    memberId: issue.memberId,
                    issueId: issue._id,
                    type: 'OVERDUE',
                    title: 'Immediate Action: Book Overdue!',
                    message: `URGENT: Your borrowed book (ID: ${issue.bookId}) was due on ${new Date(issue.dueDate).toLocaleDateString()} and is now OVERDUE. Fines are accumulating. Please return immediately.`,
                });
                count++;
            }
            this.logger.log(`Sent ${count} overdue notifications.`);
        }
        catch (error) {
            this.logger.error(`Automated overdue reminder failed: ${error.message}`);
        }
        return { message: 'Overdue notifications processed successfully', count };
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "sendDueDateReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "sendOverdueNotifications", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_entity_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        notifications_gateway_1.NotificationsGateway, typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map