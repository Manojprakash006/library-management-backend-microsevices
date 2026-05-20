import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisEmitterService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private _redisClient;
    constructor(configService: ConfigService);
    get client(): Redis;
    onModuleInit(): void;
    onModuleDestroy(): void;
    emit(event: string, data: any): Promise<void>;
}
