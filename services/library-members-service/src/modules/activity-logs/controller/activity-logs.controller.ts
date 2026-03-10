import { Controller, Get, Post, Delete, Body, Param, Query, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogsService } from '../service/activity-logs.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { ActivityLog } from '../entities/activity-log.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Activity Logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

   @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new activity log' })
  @ApiResponse({ status: 201, description: 'Activity log created successfully', type: ActivityLog })
  async create(@Body() createActivityLogDto: CreateActivityLogDto): Promise<{ message: string; data: ActivityLog }> {
    const log = await this.activityLogsService.create(createActivityLogDto);
    return { message: 'Activity log created successfully', data: log };
  }

   @Get('recent')
  @Roles('admin')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ status: 200, description: 'Recent activities retrieved successfully', type: [ActivityLog] })
  async getRecentActivities(@Query('limit') limit?: number): Promise<{ message: string; data: ActivityLog[]; count: number }> {
    const logs = await this.activityLogsService.getRecent(limit || 10);
    return { message: 'Recent activities retrieved successfully', data: logs, count: logs.length };
  }

   @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved successfully', type: [ActivityLog] })
  async findAll(@Query('limit') limit?: number): Promise<{ message: string; data: ActivityLog[]; count: number }> {
    const logs = await this.activityLogsService.findAll(limit || 50);
    return { message: 'Activity logs retrieved successfully', data: logs, count: logs.length };
  }

   @Get('member/:memberId')
  @Roles('admin', 'member')
  @ApiOperation({ summary: 'Get activity logs by member ID' })
  @ApiResponse({ status: 200, description: 'Member activity logs retrieved successfully', type: [ActivityLog] })
  async findByMember(
    @Param('memberId') memberId: string,
    @Query('limit') limit?: number,
  ): Promise<{ message: string; data: ActivityLog[]; count: number }> {
    const logs = await this.activityLogsService.findByMember(memberId, limit || 50);
    return { message: 'Member activity logs retrieved successfully', data: logs, count: logs.length };
  }

   @Get('book/:bookId')
  @Roles('admin')
  @ApiOperation({ summary: 'Get activity logs by book ID' })
  @ApiResponse({ status: 200, description: 'Book activity logs retrieved successfully', type: [ActivityLog] })
  async findByBook(
    @Param('bookId') bookId: string,
    @Query('limit') limit?: number,
  ): Promise<{ message: string; data: ActivityLog[]; count: number }> {
    const logs = await this.activityLogsService.findByBook(bookId, limit || 50);
    return { message: 'Book activity logs retrieved successfully', data: logs, count: logs.length };
  }

   @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get activity log by ID' })
  @ApiResponse({ status: 200, description: 'Activity log retrieved successfully', type: ActivityLog })
  @ApiResponse({ status: 404, description: 'Activity log not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: ActivityLog }> {
    const log = await this.activityLogsService.findOne(id);
    return { message: 'Activity log retrieved successfully', data: log };
  }

   @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete activity log' })
  @ApiResponse({ status: 200, description: 'Activity log deleted successfully' })
  @ApiResponse({ status: 404, description: 'Activity log not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.activityLogsService.remove(id);
    return { message: 'Activity log deleted successfully' };
  }
}
