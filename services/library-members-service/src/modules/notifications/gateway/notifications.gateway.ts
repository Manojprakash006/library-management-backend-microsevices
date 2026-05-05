import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  // Track connected users: userId -> socketId
  private userSockets: Map<string, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token as string;
      
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

      // Store socket connection
      this.userSockets.set(userId, client.id);
      client.join(`user_${userId}`);
      client.join(userId);
      client.join('public');

      this.logger.log(`Client connected and joined rooms: user_${userId}, ${userId}, public (${client.id})`);
      
      // Send confirmation
      client.emit('connected', { message: 'Connected to notifications', userId });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}. Connecting as public.`);
      client.join('public');
      client.emit('connected', { message: 'Connected to public notifications' });
    }
  }

  handleDisconnect(client: Socket) {
    // Remove user from tracking
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.logger.log(`Client disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(client: Socket, payload: { notificationId: string }) {
    const userId = this.getUserIdFromSocket(client.id);
    if (userId) {
      this.server.to(`user_${userId}`).emit('notificationRead', { notificationId: payload.notificationId });
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { channels: string[] }) {
    payload.channels.forEach(channel => {
      client.join(channel);
    });
    client.emit('subscribed', { channels: payload.channels });
  }

  // Method to send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).to(userId).emit('newNotification', notification);
    this.logger.log(`Notification sent to user ${userId} in rooms user_${userId} and ${userId}`);
  }

  // Method to broadcast to all connected clients (including public)
  broadcastNotification(notification: any) {
    this.server.emit('broadcastNotification', notification);
    this.server.to('public').emit('broadcastNotification', notification);
  }

  // Method to emit public updates (e.g. library info, new books)
  emitPublicUpdate(event: string, data: any) {
    this.server.to('public').emit(event, data);
    this.logger.log(`Public update emitted: ${event}`);
  }

  // Method to send unread count update
  sendUnreadCount(userId: string, count: number) {
    this.server.to(`user_${userId}`).to(userId).emit('unreadCount', count);
    this.server.to(`user_${userId}`).to(userId).emit('unreadCountData', { count });
  }

  private getUserIdFromSocket(socketId: string): string | null {
    for (const [userId, id] of this.userSockets.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return null;
  }

  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }
}
