import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MembersService } from '../service/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/guards/roles.decorator';

@ApiTags('Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Create a new member' })
  async create(@Body() createMemberDto: CreateMemberDto, @Req() req: any) {
    const adminId = req.user?.id || req.user?.userId;
    const member = await this.membersService.create(createMemberDto, adminId);
    return { message: 'Member created successfully', data: member };
  }

  @Get('stats/active')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get active members count' })
  async getActiveCount() {
    const count = await this.membersService.getActiveMembersCount();
    return { data: count };
  }

  @Get('stats/inactive')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get inactive members count' })
  async getInactiveCount() {
    const count = await this.membersService.getInactiveMembersCount();
    return { data: count };
  }

  @Get('stats/total')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get total members count' })
  async getCount() {
    const count = await this.membersService.getCount();
    return { data: count };
  }

  @Get()
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get all members' })
  async findAll() {
    const members = await this.membersService.findAll();
    return { message: 'Members retrieved successfully', data: members, count: members.length };
  }

  @Get('me')
  @Roles('member', 'admin', 'staff')
  @ApiOperation({ summary: 'Get logged-in member stats' })
  async getMyStats(@Req() req: any) {
    const userId = req.user?.userId || req.user?.id;
    const data = await this.membersService.getMyStats(userId);

    return {
      message: 'Member stats fetched',
      data,
    };
  }
  
  @Get('dashboard')
  @Roles('member', 'admin', 'staff')
    async getDashboard(@Req() req: any) {
      const userId = req.user?.userId || req.user?.id;

      const data = await this.membersService.getDashboardStats(userId);

      return {
        message: 'Dashboard stats fetched',
        data,
      };  
  }
  
  @Get(':id')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get a member by ID' })
  async findOne(@Param('id') id: string) {
    const member = await this.membersService.findOne(id);
    return { message: 'Member retrieved successfully', data: member };
  }


  @Put(':id')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Update a member' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateMemberDto>, @Req() req: any) {
    const adminId = req.user?.id || req.user?.userId;
    const member = await this.membersService.update(id, updateData, adminId);
    return { message: 'Member updated successfully', data: member };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a member' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user?.id || req.user?.userId;
    await this.membersService.remove(id, adminId);
    return { message: 'Member deleted successfully' };
  }

  @Post(':id/borrow')
  @Roles('admin', 'staff')
    async addBorrowHistory(
      @Param('id') memberId: string,
      @Body() body: any
    ) {
      await this.membersService.addBorrowingHistory(memberId, body);
      return { message: 'Borrow history added' };
  }
}
