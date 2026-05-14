import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Version,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookRequestsService } from '../service/book-requests.service';
import {
  CreateBookRequestDto,
  UpdateBookRequestDto,
} from '../dto/create-book-request.dto';
import { BookRequest } from '../entities/book-request.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Book Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book-requests')
export class BookRequestsController {
  constructor(private readonly bookRequestsService: BookRequestsService) {}

   @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new book request' })
  @ApiResponse({ status: 201, description: 'Book request created successfully', type: BookRequest })
  @ApiResponse({ status: 404, description: 'Book or Member not found' })
  @ApiResponse({ status: 400, description: 'Request ID already exists' })
  async create(
    @Body() createBookRequestDto: CreateBookRequestDto,
  ): Promise<{ message: string; data: BookRequest }> {
    const bookRequest = await this.bookRequestsService.create(createBookRequestDto);
    return { message: 'Book request created successfully', data: bookRequest };
  }

   @Get()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get all book requests' })
  @ApiResponse({ status: 200, description: 'Book requests retrieved successfully', type: [BookRequest] })
  async findAll(): Promise<{ message: string; data: BookRequest[]; count: number }> {
    const bookRequests = await this.bookRequestsService.findAll();
    const validRequests = bookRequests.filter((req) => req.bookId && req.memberId);
    return {
      message: 'Book requests retrieved successfully',
      data: validRequests,
      count: validRequests.length,
    };
  }

   @Get('member/my-requests')
  @Roles('member')
  @ApiOperation({ summary: 'Get member book requests' })
  @ApiResponse({ status: 200, description: 'Member book requests retrieved successfully', type: [BookRequest] })
  async getMemberRequests(@Req() req): Promise<{ message: string; data: BookRequest[]; count: number }> {
    const memberId = req.user.id;
    const bookRequests = await this.bookRequestsService.findByMember(memberId);
    return {
      message: 'Member book requests retrieved successfully',
      data: bookRequests,
      count: bookRequests.length,
    };
  }

   @Get(':id')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get book request by ID' })
  @ApiResponse({ status: 200, description: 'Book request retrieved successfully', type: BookRequest })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: BookRequest }> {
    const bookRequest = await this.bookRequestsService.findOne(id);
    return { message: 'Book request retrieved successfully', data: bookRequest };
  }

   @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update book request' })
  @ApiResponse({ status: 200, description: 'Book request updated successfully', type: BookRequest })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBookRequestDto: UpdateBookRequestDto,
  ): Promise<{ message: string; data: BookRequest }> {
    const bookRequest = await this.bookRequestsService.update(id, updateBookRequestDto);
    return { message: 'Book request updated successfully', data: bookRequest };
  }

   @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete book request' })
  @ApiResponse({ status: 200, description: 'Book request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.bookRequestsService.remove(id);
    return { message: 'Book request deleted successfully' };
  }

   @Put(':id/cancel')
  @Roles('member')
  @ApiOperation({ summary: 'Cancel book request (Member only)' })
  @ApiResponse({ status: 200, description: 'Book request cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to cancel this request' })
  @ApiResponse({ status: 400, description: 'Only pending requests can be cancelled' })
  async cancel(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    const memberId = req.user.id;
    await this.bookRequestsService.cancel(id, memberId);
    return { message: 'Book request cancelled successfully' };
  }

   @Put(':id/approve')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Approve book request' })
  @ApiResponse({ status: 200, description: 'Book request approved successfully', type: BookRequest })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  @ApiResponse({ status: 400, description: 'Only pending requests can be approved' })
  async approve(@Param('id') id: string, @Req() req): Promise<{ message: string; data: BookRequest }> {
    const userId = req.user.id;
    const bookRequest = await this.bookRequestsService.approve(id, userId);
    return { message: 'Book request approved successfully', data: bookRequest };
  }

   @Put(':id/reject')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Reject book request' })
  @ApiResponse({ status: 200, description: 'Book request rejected successfully', type: BookRequest })
  @ApiResponse({ status: 404, description: 'Book request not found' })
  @ApiResponse({ status: 400, description: 'Only pending requests can be rejected' })
  async reject(@Param('id') id: string, @Req() req): Promise<{ message: string; data: BookRequest }> {
    const userId = req.user.id;
    const bookRequest = await this.bookRequestsService.reject(id, userId);
    return { message: 'Book request rejected successfully', data: bookRequest };
  }
}
