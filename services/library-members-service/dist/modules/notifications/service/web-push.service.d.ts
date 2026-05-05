import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class WebPushService implements OnModuleInit {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendNotification(subscription: any, payload: any): Promise<{
        shouldDelete: boolean;
    }>;
}
