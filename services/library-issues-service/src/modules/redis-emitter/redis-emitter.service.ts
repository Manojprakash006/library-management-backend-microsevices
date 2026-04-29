import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisEmitterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisEmitterService.name);
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'redis');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisClient = new Redis({
      host,
      port,
    });

    this.redisClient.on('connect', () => {
      this.logger.log(`Connected to Redis at ${host}:${port}`);
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async emit(event: string, data: any) {
    try {
      const payload = JSON.stringify({ event, data });
      await this.redisClient.publish('lms_updates', payload);
      this.logger.log(`Published event: ${event}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event}`, error);
    }
  }
}
