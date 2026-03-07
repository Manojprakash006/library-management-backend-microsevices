import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/create-notification.dto';
import { EmailService } from './email.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly emailService: EmailService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { memberId, issueId, type, title, message, memberEmail, memberName } = createNotificationDto;

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
    this.notificationsGateway.sendNotificationToUser(memberId, savedNotification);

    // Update unread count
    const unreadCount = await this.getUnreadCount(memberId);
    this.notificationsGateway.sendUnreadCount(memberId, unreadCount);

    // Send email notification if email is provided
    if (memberEmail && memberName) {
      await this.sendEmailNotification(memberEmail, memberName, title, message, type);
    }

    return savedNotification;
  }

  async getUnreadCount(memberId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      memberId: new Types.ObjectId(memberId),
      isRead: false,
    }).exec();
  }

  private async sendEmailNotification(email: string, name: string, title: string, message: string, type: string): Promise<void> {
    try {
      if (type === 'DUE_REMINDER') {
        await this.emailService.sendEmail(email, title, message);
      } else if (type === 'OVERDUE') {
        await this.emailService.sendEmail(email, title, message);
      } else {
        await this.emailService.sendEmail(email, title, message);
      }
      this.logger.log(`Email notification sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);
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

  async sendDueDateReminders(): Promise<{ message: string; count: number }> {
    this.logger.log('Sending due date reminders');
    // TODO: Fetch due books from Issues Service and send reminders with email
    return { message: 'Due date reminders sent successfully', count: 0 };
  }

  async sendOverdueNotifications(): Promise<{ message: string; count: number }> {
    this.logger.log('Sending overdue notifications');
    // TODO: Fetch overdue books from Issues Service and send notifications with email
    return { message: 'Overdue notifications sent successfully', count: 0 };
  }
}
