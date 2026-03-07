import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class NotificationsService {
    private notificationModel;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(): Promise<Notification[]>;
    findByMember(memberId: string): Promise<Notification[]>;
    findUnreadByMember(memberId: string): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string, memberId: string): Promise<Notification>;
    markAllAsRead(memberId: string): Promise<void>;
    remove(id: string): Promise<void>;
}
