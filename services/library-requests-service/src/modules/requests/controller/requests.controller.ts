import { Controller, Get, Post, Put, Delete, Body, Param, Query, Version, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from '../service/requests.service';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
import { BookRequest } from '../entities/book-request.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';
import { ApproveRequestDto } from '../dto/approve-request.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Book Requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }


  @Post()
  @ApiOperation({ summary: 'Create a new book request' })
  @ApiResponse({ status: 201, description: 'Book request created successfully', type: BookRequest })
  async create(@Body() createDto: CreateBookRequestDto, @Req() req): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.create(createDto);
    return { message: 'Book request created successfully', data: request };
  }

  @Roles('admin', 'staff')
  @Get()
  @ApiOperation({ summary: 'Get all book requests' })
  @ApiResponse({ status: 200, description: 'Book requests retrieved successfully', type: [BookRequest] })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const result = await this.requestsService.findAll(pageNum, limitNum, status, search);
    return {
      message: 'Book requests retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  @Public()
  @Get('count/pending')
  @ApiOperation({ summary: 'Get count of pending requests' })
  @ApiResponse({ status: 200, description: 'Pending requests count retrieved successfully' })
  async getPendingCount(): Promise<{ count: number }> {
    const count = await this.requestsService.getPendingCount();
    return { count };
  }

  @Public()
  @Get('member/:memberId')
  async getRequestsByMember(
    @Param('memberId') memberId: string
  ): Promise<{ data: BookRequest[] }> {
    const requests = await this.requestsService.getByMember(memberId);
    return { data: requests };
  }

  @Put('link-issue')
  async linkIssue(
    @Body() body: {
      memberId: string;
      bookId: string;
      issueId: string;
    }
  ) {
    return this.requestsService.linkIssue(body);
  }

  @Roles('admin', 'staff')
  @Get(':id')
  @ApiOperation({ summary: 'Get book request by ID' })
  @ApiResponse({ status: 200, description: 'Book request retrieved successfully', type: BookRequest })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.findOne(id);
    return { message: 'Book request retrieved successfully', data: request };
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update book request' })
  @ApiResponse({ status: 200, description: 'Book request updated successfully', type: BookRequest })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreateBookRequestDto>): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.update(id, updateDto);
    return { message: 'Book request updated successfully', data: request };
  }

  @Roles('member')
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel book request' })
  @ApiResponse({ status: 200, description: 'Book request cancelled successfully', type: BookRequest })
  async cancel(@Param('id') id: string, @Req() req: any): Promise<{ message: string; data: BookRequest }> {
    const memberId = req.user?.id || req.user?.userId;
    const request = await this.requestsService.cancel(id, memberId);
    return { message: 'Book request cancelled successfully', data: request };
  }

  @Roles('admin', 'staff')
  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a book request' })
  @ApiResponse({ status: 200, description: 'Book request approved successfully', type: BookRequest })
  async approve(@Param('id') id: string, @Body() approveDto: ApproveRequestDto, @Req() req: any): Promise<{ message: string; data: BookRequest }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const request = await this.requestsService.approve(id, adminId, approveDto);
    return { message: 'Book request approved successfully', data: request };
  }

  @Roles('admin', 'staff')
  @Put(':issueId/mark-returned')
    async markRequestAsReturned(
      @Param('issueId') issueId: string,
    ) {
      console.log('CONTROLLER ISSUEWID:', issueId);
      return this.requestsService.markRequestAsReturned(issueId);
    }

  @Roles('admin', 'staff')
  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a book request' })
  @ApiResponse({ status: 200, description: 'Book request rejected successfully', type: BookRequest })
  async reject(@Param('id') id: string, @Req() req: any): Promise<{ message: string; data: BookRequest }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const request = await this.requestsService.reject(id, adminId);
    return { message: 'Book request rejected successfully', data: request };
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete book request' })
  @ApiResponse({ status: 200, description: 'Book request deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.requestsService.remove(id);
    return { message: 'Book request deleted successfully' };
  }
}
