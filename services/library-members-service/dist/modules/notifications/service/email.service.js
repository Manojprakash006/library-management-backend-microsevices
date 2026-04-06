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
var EmailService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: parseInt(this.configService.get('SMTP_PORT')),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get('SMTP_USER'),
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent successfully to ${to}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`);
            return false;
        }
    }
    async sendDueDateReminder(to, memberName, bookTitle, dueDate) {
        const subject = '📚 Library Due Date Reminder';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a90d9;">Library Due Date Reminder</h2>
        <p>Hi ${memberName},</p>
        <p>This is a friendly reminder that the following book is due soon:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Book:</strong> ${bookTitle}<br>
          <strong>Due Date:</strong> ${dueDate.toLocaleDateString()}<br>
          <strong>Days Remaining:</strong> ${Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
        </div>
        <p>Please return or renew the book before the due date to avoid late fees.</p>
        <p style="color: #666;">Thank you,<br>Library Management Team</p>
      </div>
    `;
        return this.sendEmail(to, subject, html);
    }
    async sendOverdueNotification(to, memberName, bookTitle, dueDate, fine) {
        const subject = '⚠️ Overdue Book Alert';
        const daysOverdue = Math.ceil((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d9534f;">⚠️ Overdue Book Alert</h2>
        <p>Hi ${memberName},</p>
        <p>The following book is now <strong>overdue</strong>:</p>
        <div style="background: #fff3f3; padding: 15px; border-radius: 5px; border-left: 4px solid #d9534f; margin: 20px 0;">
          <strong>Book:</strong> ${bookTitle}<br>
          <strong>Due Date:</strong> ${dueDate.toLocaleDateString()}<br>
          <strong>Days Overdue:</strong> ${daysOverdue} days<br>
          <strong>Current Fine:</strong> ₹${fine}
        </div>
        <p>Please return the book as soon as possible to avoid additional late fees.</p>
        <p style="color: #666;">Thank you,<br>Library Management Team</p>
      </div>
    `;
        return this.sendEmail(to, subject, html);
    }
    async sendPasswordResetEmail(to, memberName, resetToken) {
        const subject = '🔐 Password Reset Request';
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5cb85c;">Password Reset Request</h2>
        <p>Hi ${memberName},</p>
        <p>We received a request to reset your library account password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #5cb85c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #337ab7;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.<br>Library Management Team</p>
      </div>
    `;
        return this.sendEmail(to, subject, html);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);
//# sourceMappingURL=email.service.js.map