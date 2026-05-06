import { Controller, Get, Post, Delete, Body, Param, Version, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from '../service/notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiBearerAuth()   
@ApiTags('Notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully', type: Notification })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<{ message: string; data: Notification }> {
    const notification = await this.notificationsService.create(createNotificationDto);
    return { message: 'Notification created successfully', data: notification };
  }

  @Public()
  @Post('admin')
  @ApiOperation({ summary: 'Notify all admins' })
  @ApiResponse({ status: 201, description: 'Admins notified successfully' })
  async notifyAdmins(@Body() payload: { title: string; message: string; type: string; issueId?: string }): Promise<{ message: string }> {
    await this.notificationsService.notifyAdmins(payload);
    return { message: 'Admins notified successfully' };
  }

  @Public()
  @Post('staff')
  @ApiOperation({ summary: 'Notify all staff members' })
  @ApiResponse({ status: 201, description: 'Staff members notified successfully' })
  async notifyStaff(@Body() payload: { title: string; message: string; type: string; issueId?: string }): Promise<{ message: string }> {
    await this.notificationsService.notifyStaff(payload);
    return { message: 'Staff members notified successfully' };
  }

  @Public()
  @Post('members')
  @ApiOperation({ summary: 'Notify all members' })
  @ApiResponse({ status: 201, description: 'Members notified successfully' })
  async notifyMembers(@Body() payload: { title: string; message: string; type: string; issueId?: string }): Promise<{ message: string }> {
    await this.notificationsService.notifyMembers(payload);
    return { message: 'Members notified successfully' };
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully', type: [Notification] })
  async findAll(): Promise<{ message: string; data: Notification[]; count: number }> {
    const notifications = await this.notificationsService.findAll();
    return { message: 'Notifications retrieved successfully', data: notifications, count: notifications.length };
  }

  @Get('member/my-notifications')
  @Roles('member', 'admin', 'staff')
  @ApiOperation({ summary: 'Get member/admin notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully', type: [Notification] })
  async getMemberNotifications(@Req() req): Promise<{ message: string; data: Notification[]; count: number }> {
    const memberId = req.user.id;
    const notifications = await this.notificationsService.findByMember(memberId);
    return { message: 'Notifications retrieved successfully', data: notifications, count: notifications.length };
  }

  @Get('member/unread')
  @Roles('member', 'admin', 'staff')
  @ApiOperation({ summary: 'Get unread notifications' })
  @ApiResponse({ status: 200, description: 'Unread notifications retrieved successfully', type: [Notification] })
  async getUnreadNotifications(@Req() req): Promise<{ message: string; data: Notification[]; count: number }> {
    const memberId = req.user.id;
    const notifications = await this.notificationsService.findUnreadByMember(memberId);
    return { message: 'Unread notifications retrieved successfully', data: notifications, count: notifications.length };
  }

  @Post(':id/read')
  @Roles('member', 'admin', 'staff')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read', type: Notification })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string, @Req() req): Promise<{ message: string; data: Notification }> {
    const memberId = req.user.id;
    const notification = await this.notificationsService.markAsRead(id, memberId);
    return { message: 'Notification marked as read', data: notification };
  }

  @Post('mark-all-read')
  @Roles('member', 'admin', 'staff')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Req() req): Promise<{ message: string }> {
    const memberId = req.user.id;
    await this.notificationsService.markAllAsRead(memberId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.notificationsService.remove(id);
    return { message: 'Notification deleted successfully' };
  }

  @Post('send-due-reminders')
  @Roles('admin')
  @ApiOperation({ summary: 'Send due date reminders to members' })
  @ApiResponse({ status: 200, description: 'Due date reminders sent successfully' })
  async sendDueDateReminders(): Promise<{ message: string; count: number }> {
    return this.notificationsService.sendDueDateReminders();
  }

  @Post('send-overdue')
  @Roles('admin')
  @ApiOperation({ summary: 'Send overdue notifications to members' })
  @ApiResponse({ status: 200, description: 'Overdue notifications sent successfully' })
  async sendOverdueNotifications(): Promise<{ message: string; count: number }> {
    return this.notificationsService.sendOverdueNotifications();
  }
}
