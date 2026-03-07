import { Controller, Get, Post, Put, Delete, Body, Param, Version, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from '../service/requests.service';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';
import { BookRequest } from '../entities/book-request.entity';

@ApiBearerAuth()
@ApiTags('Book Requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Create a new book request' })
  @ApiResponse({ status: 201, description: 'Book request created successfully', type: BookRequest })
  async create(@Body() createDto: CreateBookRequestDto): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.create(createDto);
    return { message: 'Book request created successfully', data: request };
  }

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get all book requests' })
  @ApiResponse({ status: 200, description: 'Book requests retrieved successfully', type: [BookRequest] })
  async findAll(): Promise<{ message: string; data: BookRequest[]; count: number }> {
    const requests = await this.requestsService.findAll();
    return { message: 'Book requests retrieved successfully', data: requests, count: requests.length };
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get book request by ID' })
  @ApiResponse({ status: 200, description: 'Book request retrieved successfully', type: BookRequest })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.findOne(id);
    return { message: 'Book request retrieved successfully', data: request };
  }

  @Version('1')
  @Put(':id')
  @ApiOperation({ summary: 'Update book request' })
  @ApiResponse({ status: 200, description: 'Book request updated successfully', type: BookRequest })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreateBookRequestDto>): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.update(id, updateDto);
    return { message: 'Book request updated successfully', data: request };
  }

  @Version('1')
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel book request' })
  @ApiResponse({ status: 200, description: 'Book request cancelled successfully', type: BookRequest })
  async cancel(@Param('id') id: string, @Req() req): Promise<{ message: string; data: BookRequest }> {
    const memberId = req.user.id;
    const request = await this.requestsService.cancel(id, memberId);
    return { message: 'Book request cancelled successfully', data: request };
  }

  @Version('1')
  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a book request' })
  @ApiResponse({ status: 200, description: 'Book request approved successfully', type: BookRequest })
  async approve(@Param('id') id: string): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.approve(id);
    return { message: 'Book request approved successfully', data: request };
  }

  @Version('1')
  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a book request' })
  @ApiResponse({ status: 200, description: 'Book request rejected successfully', type: BookRequest })
  async reject(@Param('id') id: string): Promise<{ message: string; data: BookRequest }> {
    const request = await this.requestsService.reject(id);
    return { message: 'Book request rejected successfully', data: request };
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete book request' })
  @ApiResponse({ status: 200, description: 'Book request deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.requestsService.remove(id);
    return { message: 'Book request deleted successfully' };
  }
}
