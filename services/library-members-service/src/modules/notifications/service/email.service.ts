import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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

  async sendEmail(to: string, subject: string, html: string, attachments?: any[]): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to,
        subject,
        html,
        attachments,
      });
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  async sendInvoiceEmail(to: string, memberName: string, invoiceId: string, pdfBuffer: Buffer): Promise<boolean> {
    const subject = `📑 Invoice for your Library Payment - ${invoiceId}`;
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Payment Successful</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; background: #fff;">
          <p style="font-size: 18px; font-weight: 600; color: #1f2937;">Hi ${memberName},</p>
          <p>Thank you for your payment. Your transaction has been successfully processed, and your library account has been updated.</p>
          <p>Attached to this email, you will find the official invoice <strong>#${invoiceId}</strong> for your records.</p>
          
          <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #4f46e5;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Invoice Number</p>
            <p style="margin: 5px 0 0 0; font-weight: 700; color: #1f2937;">${invoiceId}</p>
          </div>

          <p>If you have any questions regarding this payment or your account, please feel free to reach out to our support team.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Library Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail(to, subject, html, [
      {
        filename: `Invoice_${invoiceId}.pdf`,
        content: pdfBuffer,
      },
    ]);
  }

  async sendDueDateReminder(to: string, memberName: string, bookTitle: string, dueDate: Date): Promise<boolean> {
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

  async sendOverdueNotification(to: string, memberName: string, bookTitle: string, dueDate: Date, fine: number): Promise<boolean> {
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

  async sendPasswordResetEmail(to: string, memberName: string, resetToken: string): Promise<boolean> {
    const subject = '🔐 Password Reset Request';
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
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
}
