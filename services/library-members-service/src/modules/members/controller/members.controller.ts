import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
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
    constructor(private readonly membersService: MembersService) { }

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
    async findAll(@Req() req: any) {
        const token = req.headers.authorization;
        const members = await this.membersService.findAll(token);
        return { message: 'Members retrieved successfully', data: members, count: members.length };
    }

    @Get('me')
    @Roles('admin', 'member', 'staff')
    @ApiOperation({ summary: 'Get member stats'})
      async getFooterStats(@Req() req: any) {
          const userId = req.user.id;
          const token = req.headers.authorization;
          if (!userId) {
            throw new BadRequestException('User ID is missing');
          }
          const footerStats = await this.membersService.getMyStats(userId, token);
          return { message: 'Data retrieved successfully', data: footerStats };
    }

    @Get(':id')
    @Roles('admin', 'staff', 'member')
    @ApiOperation({ summary: 'Get a member by ID' })
    async findOne(@Param('id') id: string, @Req() req: any) {
        const token = req.headers.authorization;
        const member = await this.membersService.findOne(id, token);
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
}
