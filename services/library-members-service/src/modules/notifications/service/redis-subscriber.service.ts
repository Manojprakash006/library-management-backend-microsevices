import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisSubscriberService.name);
  private redisClient: Redis;

  constructor(
    private configService: ConfigService,
    private notificationsGateway: NotificationsGateway
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'redis');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisClient = new Redis({
      host,
      port,
    });

    this.redisClient.on('connect', () => {
      this.logger.log(`Connected to Redis for subscription at ${host}:${port}`);
      this.redisClient.subscribe('lms_updates');
    });

    this.redisClient.on('message', (channel, message) => {
      if (channel === 'lms_updates') {
        this.handleLmsUpdate(message);
      }
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis subscription error', err);
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  private handleLmsUpdate(message: string) {
    try {
      const payload = JSON.parse(message);
      const { event, data } = payload;
      
      this.logger.log(`Received real-time update: ${event}`);
      
      // Broadcast to all connected clients
      this.notificationsGateway.server.emit(event, data);
      
      // Also emit a general update event
      this.notificationsGateway.server.emit('DATA_UPDATED', { event, data });
      
    } catch (error) {
      this.logger.error('Failed to parse Redis message', error);
    }
  }
}
