import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    memberId: string;
    issueId?: string;
    type: NotificationType;
    title: string;
    message: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
}
