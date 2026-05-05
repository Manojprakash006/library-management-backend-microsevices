import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member, MemberDocument } from '../../members/entities/member.entity';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationDocument } from '../entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/create-notification.dto';
import { EmailService } from './email.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { NotificationType } from '../entities/notification.entity';
import { WebPushService } from './web-push.service';
import { PushSubscription } from '../schema/push-subscription.schema';
import { LibraryConfig, LibraryConfigDocument } from '../../contact/entities/library-config.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Member.name)
    private memberModel: Model<MemberDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(PushSubscription.name)
    private pushSubscriptionModel: Model<PushSubscription>,
    @InjectModel(LibraryConfig.name)
    private libraryConfigModel: Model<LibraryConfigDocument>,
    private readonly emailService: EmailService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly httpService: HttpService,
    private readonly webPushService: WebPushService,
  ) { }

  private async getBookDetails(bookId: string): Promise<any> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      const response = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${bookId}`));
      return response.data?.data || response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch book details: ${error.message}`);
      return null;
    }
  }

  private async getLibraryInfo(): Promise<LibraryConfig> {
    try {
      let config = await this.libraryConfigModel.findOne().exec();
      if (!config) {
        config = new this.libraryConfigModel({});
        await config.save();
      }
      return config;
    } catch (error) {
      this.logger.error(`Failed to fetch library info: ${error.message}`);
      return {} as any;
    }
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    let { memberId, issueId, type, title, message, memberEmail, memberName } = createNotificationDto;

    // Fetch member details if email/name not provided
    if (!memberEmail || !memberName) {
      try {
        const member = await this.memberModel.findById(memberId).exec();
        if (member) {
          memberEmail = memberEmail || member.email;
          memberName = memberName || member.name;
        } else {
          // Check Staff collection (Leaving staff as is for now since I didn't inject it yet)
          const StaffSchema = this.notificationModel.db.model('Staff');
          const staff = await StaffSchema.findById(memberId).exec();
          if (staff) {
            memberEmail = memberEmail || staff.email;
            memberName = memberName || staff.fullName || staff.name;
          } else {
            // Check User collection for admins
            const user = await this.userModel.findById(memberId).exec();
            if (user) {
              memberEmail = memberEmail || user.email;
              memberName = memberName || user.name;
            }
          }
        }
      } catch (err) {
        this.logger.error(`Could not fetch user/member details for notification: ${err.message}`);
      }
    }

    // Smart Enrichment: Fetch Book Title if not provided in message but issueId/bookId is available
    if (issueId && !message.includes('"')) {
       try {
         let bookIdToFetch = issueId;
         
         // Try to see if it's an issue first
         try {
           const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
           const issueResponse = await firstValueFrom(this.httpService.get(`${issuesServiceUrl}/issues/${issueId}`));
           if (issueResponse.data?.bookId) {
             bookIdToFetch = issueResponse.data.bookId;
           }
         } catch (err) {
           // Not an issue ID, maybe it's a direct book ID
         }

         const book = await this.getBookDetails(bookIdToFetch);
         if (book?.title) {
           message = message.replace(`ID: ${bookIdToFetch}`, `"${book.title}" (ID: ${bookIdToFetch})`);
           // Also handle cases where it was passed as Issue ID in the string
           message = message.replace(`ID: ${issueId}`, `"${book.title}" (ID: ${issueId})`);
         }
       } catch (e) {
         this.logger.error(`Failed to enrich notification: ${e.message}`);
       }
    }
    const createdNotification = new this.notificationModel({
      memberId: new Types.ObjectId(memberId),
      issueId: issueId ? new Types.ObjectId(issueId) : undefined,
      type,
      title,
      message,
      isRead: false,
      sentAt: new Date(),
    });

    const savedNotification = await createdNotification.save();

    // Send real-time WebSocket notification
    this.notificationsGateway.sendNotificationToUser(memberId.toString(), savedNotification);

    // Update unread count
    const unreadCount = await this.getUnreadCount(memberId.toString());
    this.notificationsGateway.sendUnreadCount(memberId.toString(), unreadCount);

    // Send email notification if email is provided
    if (memberEmail && memberName) {
      await this.sendEmailNotification(memberEmail, memberName, title, message, type);
    }

    // Send Web Push notification
    await this.sendPushToUser(memberId.toString(), { title, message, type });

    return savedNotification;
  }

  async getUnreadCount(memberId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      memberId: new Types.ObjectId(memberId),
      isRead: false,
    }).exec();
  }

  async notifyAdmins(payload: { title: string; message: string; type: string; issueId?: string }): Promise<void> {
    try {
      const admins = await this.userModel.find({ role: 'admin' }).exec();

      for (const admin of admins) {
        await this.create({
          memberId: admin._id.toString(),
          title: payload.title,
          message: payload.message,
          type: payload.type as any,
          issueId: payload.issueId,
          memberEmail: admin.email,
          memberName: admin.name
        });
      }
      this.logger.log(`Notified ${admins.length} admins about: ${payload.title}`);
    } catch (err) {
      this.logger.error(`Failed to notify admins: ${err.message}`);
    }
  }

  async notifyStaff(payload: { title: string; message: string; type: string; issueId?: string }): Promise<void> {
    try {
      // Fetch staff from Staff collection
      const StaffSchema = this.notificationModel.db.model('Staff');
      const staffMembers = await StaffSchema.find({ role: { $in: ['staff', 'librarian', 'admin'] } }).exec();
      
      const allStaffToNotify = [
        ...staffMembers.map(s => ({ _id: s._id, email: s.email, name: s.fullName || s.name }))
      ];
      
      for (const staff of allStaffToNotify) {
        await this.create({
          memberId: staff._id.toString(),
          title: payload.title,
          message: payload.message,
          type: payload.type as any,
          issueId: payload.issueId,
          memberEmail: staff.email,
          memberName: staff.name
        });
      }
      this.logger.log(`Notified ${allStaffToNotify.length} staff members about: ${payload.title}`);
    } catch (err) {
      this.logger.error(`Failed to notify staff: ${err.message}`);
    }
  }

  async notifyMembers(payload: { title: string; message: string; type: string; issueId?: string }): Promise<void> {
    try {
      // Fetch members from Member collection
      const MemberSchema = this.notificationModel.db.model('Member');
      const members = await MemberSchema.find().exec();
      
      const allMembersToNotify = [
        ...members.map(m => ({ _id: m._id, email: m.email, name: m.name }))
      ];
      
      for (const member of allMembersToNotify) {
        await this.create({
          memberId: member._id.toString(),
          title: payload.title,
          message: payload.message,
          type: payload.type as any,
          issueId: payload.issueId,
          memberEmail: member.email,
          memberName: member.name
        });
      }
      this.logger.log(`Notified ${allMembersToNotify.length} members about: ${payload.title}`);
    } catch (err) {
      this.logger.error(`Failed to notify members: ${err.message}`);
    }
  }

  private async sendEmailNotification(email: string, name: string, title: string, message: string, type: string): Promise<void> {
    try {
      // Determine color based on Notification Type
      let color = '#4f46e5'; // Default Blue
      let icon = '🔔';
      if (type.includes('APPROVE') || type.includes('ADDED') || type.includes('ISSUE') || type.includes('PAYMENT')) { color = '#10b981'; icon = '✅'; }
      if (type.includes('REJECT') || type.includes('OVERDUE')) { color = '#ef4444'; icon = '⚠️'; }
      if (type.includes('DUE') || type.includes('FINE')) { color = '#f59e0b'; icon = '⏳'; }


      // Fetch Library Name for Footer
      const libConfig = await this.getLibraryInfo();
      const libName = libConfig?.libraryName || 'Modern Library Management System';

      // Build Beautiful HTML Template Wrapper
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
            If you have any questions, feel free to reply to this email or contact the librarian at ${libConfig?.email || 'the library'}.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0 15px 0;">
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} ${libName}. All rights reserved.
          </p>
        </div>
      </div>
      `;

      await this.emailService.sendEmail(email, title, htmlTemplate);
      this.logger.log(`Email styled notification sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send styled email to ${email}: ${error.message}`);
    }
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findByMember(memberId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ memberId: new Types.ObjectId(memberId) })
      .populate('issueId', 'bookId dueDate')
      .sort('-createdAt')
      .limit(50)
      .exec();
  }

  async findUnreadByMember(memberId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ memberId: new Types.ObjectId(memberId), isRead: false })
      .populate('issueId', 'bookId dueDate')
      .sort('-createdAt')
      .exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findById(id)
      .populate('issueId', 'bookId dueDate')
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, memberId: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        { _id: id, memberId: new Types.ObjectId(memberId) },
        { isRead: true },
        { new: true },
      )
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Send updated unread count via WebSocket
    const unreadCount = await this.getUnreadCount(memberId);
    this.notificationsGateway.sendUnreadCount(memberId, unreadCount);
    this.notificationsGateway.sendNotificationToUser(memberId, { type: 'notificationRead', notificationId: id });

    return notification;
  }

  async markAllAsRead(memberId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { memberId: new Types.ObjectId(memberId), isRead: false },
        { isRead: true },
      )
      .exec();

    // Send updated unread count via WebSocket
    this.notificationsGateway.sendUnreadCount(memberId, 0);
    this.notificationsGateway.sendNotificationToUser(memberId, { type: 'allNotificationsRead' });
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Notification not found');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDueDateReminders(): Promise<{ message: string; count: number }> {
    this.logger.log('Executing automated Due Date Reminders cron job...');
    let count = 0;
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
      const response = await firstValueFrom(this.httpService.get(`${issuesServiceUrl}/issues`));
      const allIssues = response.data?.data || [];

      // Find active issues due exactly tomorrow or today
      const today = new Date();
      const dueIssues = allIssues.filter((issue: any) => {
        if (issue.status !== 'Active' || !issue.dueDate) return false;
        const due = new Date(issue.dueDate);
        const todayCopy = new Date(today);
        todayCopy.setHours(0, 0, 0, 0);
        const dueCopy = new Date(due);
        dueCopy.setHours(0, 0, 0, 0);
        
        const diffTime = dueCopy.getTime() - todayCopy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 1; // Due today or tomorrow
      });

      for (const issue of dueIssues) {
        const book = await this.getBookDetails(issue.bookId);
        const bookInfo = book?.title ? `"${book.title}" (ID: ${issue.bookId})` : `Book ID: ${issue.bookId}`;

        await this.create({
          memberId: issue.memberId,
          issueId: issue._id,
          type: NotificationType.DUE_REMINDER,
          title: 'Upcoming Due Date Reminder',
          message: `Friendly reminder: Your borrowed book ${bookInfo} is due soon on ${new Date(issue.dueDate).toLocaleDateString()}. Please return it to avoid fines.`,
        });
        count++;
      }
      this.logger.log(`Sent ${count} due date reminders.`);
    } catch (error) {
      this.logger.error(`Automated due date reminder failed: ${error.message}`);
    }
    return { message: 'Due date reminders processed successfully', count };
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendOverdueNotifications(): Promise<{ message: string; count: number }> {
    this.logger.log('Executing automated Overdue Notifications cron job...');
    let count = 0;
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';
      const response = await firstValueFrom(this.httpService.get(`${issuesServiceUrl}/issues/overdue`));
      const overdueIssues = response.data?.data || [];

      for (const issue of overdueIssues) {
        const book = await this.getBookDetails(issue.bookId);
        const bookInfo = book?.title ? `"${book.title}" (ID: ${issue.bookId})` : `Book ID: ${issue.bookId}`;

        await this.create({
          memberId: issue.memberId,
          issueId: issue._id,
          type: NotificationType.OVERDUE,
          title: 'Immediate Action: Book Overdue!',
          message: `URGENT: Your borrowed book ${bookInfo} was due on ${new Date(issue.dueDate).toLocaleDateString()} and is now OVERDUE. Fines are accumulating. Please return immediately.`,
        });
        count++;
      }
      this.logger.log(`Sent ${count} overdue notifications.`);
    } catch (error) {
      this.logger.error(`Automated overdue reminder failed: ${error.message}`);
    }
    return { message: 'Overdue notifications processed successfully', count };
  }

  async savePushSubscription(userId: string, subscription: any): Promise<void> {
    // Upsert subscription
    await this.pushSubscriptionModel.findOneAndUpdate(
      { userId, 'subscription.endpoint': subscription.endpoint },
      { userId, subscription },
      { upsert: true, new: true }
    ).exec();
    this.logger.log(`Saved push subscription for user: ${userId}`);
  }

  async sendPushToUser(userId: string, payload: { title: string; message: string; type: string }): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionModel.find({ userId }).exec();
      
      for (const sub of subscriptions) {
        const result = await this.webPushService.sendNotification(sub.subscription, payload);
        if (result.shouldDelete) {
          await this.pushSubscriptionModel.findByIdAndDelete(sub._id).exec();
        }
      }
    } catch (err) {
      this.logger.error(`Failed to send web push notifications: ${err.message}`);
    }
  }
}
