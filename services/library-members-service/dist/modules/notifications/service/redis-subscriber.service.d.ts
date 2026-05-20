import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsGateway } from '../gateway/notifications.gateway';
export declare class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private notificationsGateway;
    private readonly logger;
    private redisClient;
    constructor(configService: ConfigService, notificationsGateway: NotificationsGateway);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private handleLmsUpdate;
    private broadcastAsNotification;
}
