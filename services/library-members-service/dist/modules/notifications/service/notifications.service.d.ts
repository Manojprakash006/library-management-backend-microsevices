import { Model } from 'mongoose';
import { MemberDocument } from '../../members/entities/member.entity';
import { UserDocument } from '../../auth/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { Notification, NotificationDocument } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { EmailService } from './email.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { WebPushService } from './web-push.service';
import { PushSubscription } from '../schema/push-subscription.schema';
export declare class NotificationsService {
    private notificationModel;
    private memberModel;
    private userModel;
    private pushSubscriptionModel;
    private readonly emailService;
    private readonly notificationsGateway;
    private readonly httpService;
    private readonly webPushService;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>, memberModel: Model<MemberDocument>, userModel: Model<UserDocument>, pushSubscriptionModel: Model<PushSubscription>, emailService: EmailService, notificationsGateway: NotificationsGateway, httpService: HttpService, webPushService: WebPushService);
    private getBookDetails;
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    getUnreadCount(memberId: string): Promise<number>;
    notifyAdmins(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<void>;
    notifyStaff(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<void>;
    notifyMembers(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<void>;
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
    savePushSubscription(userId: string, subscription: any): Promise<void>;
    sendPushToUser(userId: string, payload: {
        title: string;
        message: string;
        type: string;
    }): Promise<void>;
}
