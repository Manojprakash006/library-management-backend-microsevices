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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("../service/notifications.service");
const create_notification_dto_1 = require("../dto/create-notification.dto");
const notification_entity_1 = require("../entities/notification.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async create(createNotificationDto) {
        const notification = await this.notificationsService.create(createNotificationDto);
        return { message: 'Notification created successfully', data: notification };
    }
    async findAll() {
        const notifications = await this.notificationsService.findAll();
        return { message: 'Notifications retrieved successfully', data: notifications, count: notifications.length };
    }
    async getMemberNotifications(req) {
        const memberId = req.user.id;
        const notifications = await this.notificationsService.findByMember(memberId);
        return { message: 'Member notifications retrieved successfully', data: notifications, count: notifications.length };
    }
    async getUnreadNotifications(req) {
        const memberId = req.user.id;
        const notifications = await this.notificationsService.findUnreadByMember(memberId);
        return { message: 'Unread notifications retrieved successfully', data: notifications, count: notifications.length };
    }
    async markAsRead(id, req) {
        const memberId = req.user.id;
        const notification = await this.notificationsService.markAsRead(id, memberId);
        return { message: 'Notification marked as read', data: notification };
    }
    async markAllAsRead(req) {
        const memberId = req.user.id;
        await this.notificationsService.markAllAsRead(memberId);
        return { message: 'All notifications marked as read' };
    }
    async remove(id) {
        await this.notificationsService.remove(id);
        return { message: 'Notification deleted successfully' };
    }
    async sendDueDateReminders() {
        return this.notificationsService.sendDueDateReminders();
    }
    async sendOverdueNotifications() {
        return this.notificationsService.sendOverdueNotifications();
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new notification' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notification created successfully', type: notification_entity_1.Notification }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notifications retrieved successfully', type: [notification_entity_1.Notification] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('member/my-notifications'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member notifications retrieved successfully', type: [notification_entity_1.Notification] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMemberNotifications", null);
__decorate([
    (0, common_1.Get)('member/unread'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notifications for member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread notifications retrieved successfully', type: [notification_entity_1.Notification] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadNotifications", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read', type: notification_entity_1.Notification }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('send-due-reminders'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Send due date reminders to members' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Due date reminders sent successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendDueDateReminders", null);
__decorate([
    (0, common_1.Post)('send-overdue'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Send overdue notifications to members' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue notifications sent successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendOverdueNotifications", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map