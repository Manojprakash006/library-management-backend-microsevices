"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisSubscriberService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSubscriberService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const notifications_gateway_1 = require("../gateway/notifications.gateway");
let RedisSubscriberService = RedisSubscriberService_1 = class RedisSubscriberService {
    constructor(configService, notificationsGateway) {
        this.configService = configService;
        this.notificationsGateway = notificationsGateway;
        this.logger = new common_1.Logger(RedisSubscriberService_1.name);
    }
    onModuleInit() {
        const host = this.configService.get('REDIS_HOST', 'redis');
        const port = this.configService.get('REDIS_PORT', 6379);
        this.redisClient = new ioredis_1.default({
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
    handleLmsUpdate(message) {
        try {
            const payload = JSON.parse(message);
            const { event, data } = payload;
            this.logger.log(`Received real-time update: ${event}`);
            this.notificationsGateway.server.emit(event, data);
            this.notificationsGateway.server.emit('DATA_UPDATED', { event, data });
            this.broadcastAsNotification(event, data);
        }
        catch (error) {
            this.logger.error('Failed to parse Redis message', error);
        }
    }
    broadcastAsNotification(event, data) {
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
                return;
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
};
exports.RedisSubscriberService = RedisSubscriberService;
exports.RedisSubscriberService = RedisSubscriberService = RedisSubscriberService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, notifications_gateway_1.NotificationsGateway])
], RedisSubscriberService);
//# sourceMappingURL=redis-subscriber.service.js.map