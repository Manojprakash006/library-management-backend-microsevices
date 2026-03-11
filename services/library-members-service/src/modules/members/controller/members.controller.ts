import { Controller, Get, Post, Put, Delete, Body, Param, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MembersService } from '../service/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { Member } from '../entities/member.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

   @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created successfully', type: Member })
  @ApiResponse({ status: 409, description: 'Member ID or email already exists' })
  async create(@Body() createMemberDto: CreateMemberDto): Promise<{ message: string; data: Member }> {
    const member = await this.membersService.create(createMemberDto);
    return { message: 'Member created successfully', data: member };
  }

   @Public()
   @Get('count')
  @ApiOperation({ summary: 'Get total members count' })
  @ApiResponse({ status: 200, description: 'Members count retrieved successfully' })
  async getCount(): Promise<{ count: number }> {
    const count = await this.membersService.getCount();
    return { count };
  }

   @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: [Member] })
  async findAll(): Promise<{ message: string; data: Member[]; count: number }> {
    const members = await this.membersService.findAll();
    return { message: 'Members retrieved successfully', data: members, count: members.length };
  }

   @Get(':id')
  @ApiOperation({ summary: 'Get member by ID' })
  @ApiResponse({ status: 200, description: 'Member retrieved successfully', type: Member })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: Member }> {
    const member = await this.membersService.findOne(id);
    return { message: 'Member retrieved successfully', data: member };
  }

   @Put(':id')
  @ApiOperation({ summary: 'Update member' })
  @ApiResponse({ status: 200, description: 'Member updated successfully', type: Member })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateMemberDto>): Promise<{ message: string; data: Member }> {
    const member = await this.membersService.update(id, updateData);
    return { message: 'Member updated successfully', data: member };
  }

   @Delete(':id')
  @ApiOperation({ summary: 'Delete member' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.membersService.remove(id);
    return { message: 'Member deleted successfully' };
  }
}
