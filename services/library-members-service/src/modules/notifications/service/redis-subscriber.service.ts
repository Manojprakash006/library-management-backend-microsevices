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
      
      // 1. Broadcast the original event (for background data refresh)
      this.notificationsGateway.server.emit(event, data);
      
      // 2. Also emit a general update event
      this.notificationsGateway.server.emit('DATA_UPDATED', { event, data });
      
      // 3. Generate a user-facing notification for significant events
      this.broadcastAsNotification(event, data);
      
    } catch (error) {
      this.logger.error('Failed to parse Redis message', error);
    }
  }

  private broadcastAsNotification(event: string, data: any) {
    let title = 'Library Update';
    let message = '';
    let type = 'INFO';

    switch (event) {
      case 'BOOKS_UPDATED':
        if (data.type === 'create') {
          title = 'New Book Added';
          message = `"${data.book?.title || 'A new book'}" has been added to the library.`;
        }
        break;
      case 'REQUEST_CREATED':
        title = 'New Book Request';
        message = 'A new book request has been received from a member.';
        type = 'REQUEST';
        break;
      case 'REQUEST_APPROVED':
        title = 'Request Approved';
        message = 'A book request has been approved.';
        type = 'REQUEST_STATUS';
        break;
      case 'REQUEST_REJECTED':
        title = 'Request Rejected';
        message = 'A book request has been rejected.';
        type = 'REQUEST_STATUS';
        break;
      case 'ISSUES_UPDATED':
        title = 'Inventory Update';
        message = 'A book has been issued or returned.';
        if (data.status === 'Overdue') {
          title = 'Book Overdue';
          message = `The book "${data.bookTitle || 'A book'}" is now overdue for member ${data.memberName || ''}.`;
          type = 'OVERDUE_ALERT';
        }
        break;
      case 'FINES_UPDATED':
        title = 'Fine Update';
        message = 'A fine has been paid or updated.';
        break;
      default:
        return; // Don't notify for other events
    }

    if (message) {
      this.notificationsGateway.server.emit('newNotification', {
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        data
      });
    }
  }
}
