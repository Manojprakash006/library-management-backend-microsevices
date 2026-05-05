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
var _a, _b, _c, _d;
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
                this.logger.warn('Client connected without token');
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.userId || payload.id || payload.sub;
            if (!userId) {
                this.logger.warn('Token verified but no userId found');
                client.disconnect();
                return;
            }
            this.userSockets.set(userId, client.id);
            client.join(`user_${userId}`);
            client.join(userId);
            this.logger.log(`Client connected and joined rooms: user_${userId}, ${userId} (${client.id})`);
            client.emit('connected', { message: 'Connected to notifications', userId });
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
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
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleSubscribe", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/notifications',
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map