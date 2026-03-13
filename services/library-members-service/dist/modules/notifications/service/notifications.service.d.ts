import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { EmailService } from './email.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';
export declare class NotificationsService {
    private notificationModel;
    private readonly emailService;
    private readonly notificationsGateway;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>, emailService: EmailService, notificationsGateway: NotificationsGateway);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    getUnreadCount(memberId: string): Promise<number>;
    private sendEmailNotification;
    findAll(): Promise<Notification[]>;
    findByMember(memberId: string): Promise<Notification[]>;
    findUnreadByMember(memberId: string): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string, memberId: string): Promise<Notification>;
    markAllAsRead(memberId: string): Promise<void>;
    remove(id: string): Promise<void>;
    sendDueDateReminders(): Promise<{
        message: string;
        count: number;
    }>;
    sendOverdueNotifications(): Promise<{
        message: string;
        count: number;
    }>;
}
