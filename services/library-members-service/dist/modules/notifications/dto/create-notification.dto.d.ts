import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    memberId: string;
    issueId?: string;
    type: NotificationType;
    title: string;
    message: string;
    memberEmail?: string;
    memberName?: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
}
