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
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.query.token;
            if (!token) {
                this.logger.log(`Public client connected: ${client.id}`);
                client.join('public');
                client.emit('connected', { message: 'Connected to public notifications' });
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.userId || payload.id || payload.sub;
            if (!userId) {
                this.logger.log(`Public client connected (invalid token): ${client.id}`);
                client.join('public');
                client.emit('connected', { message: 'Connected to public notifications' });
                return;
            }
            this.userSockets.set(userId, client.id);
            client.join(`user_${userId}`);
            client.join(userId);
            client.join('public');
            this.logger.log(`Client connected and joined rooms: user_${userId}, ${userId}, public (${client.id})`);
            client.emit('connected', { message: 'Connected to notifications', userId });
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}. Connecting as public.`);
            client.join('public');
            client.emit('connected', { message: 'Connected to public notifications' });
        }
    }
    handleDisconnect(client) {
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                this.logger.log(`Client disconnected: ${userId}`);
                break;
            }
        }
    }
    handleMarkAsRead(client, payload) {
        const userId = this.getUserIdFromSocket(client.id);
        if (userId) {
            this.server.to(`user_${userId}`).emit('notificationRead', { notificationId: payload.notificationId });
        }
    }
    handleSubscribe(client, payload) {
        payload.channels.forEach(channel => {
            client.join(channel);
        });
        client.emit('subscribed', { channels: payload.channels });
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(`user_${userId}`).to(userId).emit('newNotification', notification);
        this.logger.log(`Notification sent to user ${userId} in rooms user_${userId} and ${userId}`);
    }
    broadcastNotification(notification) {
        this.server.emit('broadcastNotification', notification);
        this.server.to('public').emit('broadcastNotification', notification);
    }
    emitPublicUpdate(event, data) {
        this.server.to('public').emit(event, data);
        this.logger.log(`Public update emitted: ${event}`);
    }
    sendUnreadCount(userId, count) {
        this.server.to(`user_${userId}`).to(userId).emit('unreadCount', count);
        this.server.to(`user_${userId}`).to(userId).emit('unreadCountData', { count });
    }
    getUserIdFromSocket(socketId) {
        for (const [userId, id] of this.userSockets.entries()) {
            if (id === socketId) {
                return userId;
            }
        }
        return null;
    }
    getConnectedUsersCount() {
        return this.userSockets.size;
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleSubscribe", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/notifications',
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map