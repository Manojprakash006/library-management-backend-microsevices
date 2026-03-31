export declare class CreateActivityLogDto {
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: Record<string, any>;
}
