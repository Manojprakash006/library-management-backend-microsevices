import { NotificationsService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        message: string;
        data: Notification;
    }>;
    notifyAdmins(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<{
        message: string;
    }>;
    notifyStaff(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<{
        message: string;
    }>;
    notifyMembers(payload: {
        title: string;
        message: string;
        type: string;
        issueId?: string;
    }): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        message: string;
        data: Notification[];
        count: number;
    }>;
    getMemberNotifications(req: any): Promise<{
        message: string;
        data: Notification[];
        count: number;
    }>;
    getUnreadNotifications(req: any): Promise<{
        message: string;
        data: Notification[];
        count: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        message: string;
        data: Notification;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendDueDateReminders(): Promise<{
        message: string;
        count: number;
    }>;
    sendOverdueNotifications(): Promise<{
        message: string;
        count: number;
    }>;
    subscribeToPush(subscription: any, req: any): Promise<{
        message: string;
    }>;
}
