import { Controller, Get, Post, Body, Query, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogService } from '../service/activity-log.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiTags('Activity Logs')
@Controller('activities')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Public()
  @Post('logs')
  @ApiOperation({ summary: 'Create an activity log internally or from other services' })
  @ApiResponse({ status: 201, description: 'Activity log created successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createLog(@Body() createActivityLogDto: CreateActivityLogDto, @Res() res: Response) {
    const log = await this.activityLogService.logAction(createActivityLogDto);
    if (!log) {
       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
         message: 'Failed to create activity log' 
       });
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Activity log created successfully',
      data: log,
    });
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get paginated activity logs with optional filters' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'adminId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'entityType', required: false, type: String })
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('adminId') adminId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Res() res?: Response
  ) {
    const filters: any = {};
    if (adminId) filters.adminId = adminId;
    if (action) filters.action = action;
    if (entityType) filters.entityType = entityType;

    const result = await this.activityLogService.getLogs(Number(page), Number(limit), filters);
    
    if (res) {
      return res.status(HttpStatus.OK).json({
        message: 'Activity logs retrieved successfully',
        data: result.data,
        count: result.count,
        page: Number(page),
        limit: Number(limit)
      });
    }
    return result;
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get top recent activity logs' })
  @ApiResponse({ status: 200, description: 'Recent logs retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentLogs(@Query('limit') limit = 10, @Res() res?: Response) {
    const logs = await this.activityLogService.getRecentLogs(Number(limit));
    if (res) {
       return res.status(HttpStatus.OK).json({
        message: 'Recent activity logs retrieved successfully',
        data: logs,
        count: logs.length
      });
    }
    return logs;
  }
}
