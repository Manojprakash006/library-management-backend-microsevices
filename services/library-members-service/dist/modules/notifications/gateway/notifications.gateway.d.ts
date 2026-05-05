import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMarkAsRead(client: Socket, payload: {
        notificationId: string;
    }): void;
    handleSubscribe(client: Socket, payload: {
        channels: string[];
    }): void;
    sendNotificationToUser(userId: string, notification: any): void;
    broadcastNotification(notification: any): void;
    sendUnreadCount(userId: string, count: number): void;
    private getUserIdFromSocket;
    getConnectedUsersCount(): number;
}
