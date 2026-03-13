import { Controller, Get, Post, Put, Delete, Body, Param, Version, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IssuesService } from '../service/issues.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { IssueBook } from '../entities/issue-book.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

   @Post()
  @ApiOperation({ summary: 'Issue a book' })
  @ApiResponse({ status: 201, description: 'Book issued successfully', type: IssueBook })
  async create(@Body() createIssueDto: CreateIssueDto): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.create(createIssueDto);
    return { message: 'Book issued successfully', data: issue };
  }

   @Get()
  @ApiOperation({ summary: 'Get all issued books' })
  @ApiResponse({ status: 200, description: 'Issued books retrieved successfully', type: [IssueBook] })
  async findAll(): Promise<{ message: string; data: IssueBook[]; count: number }> {
    const issues = await this.issuesService.findAll();
    return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
  }

   @Public()
   @Get('recent')
  @ApiOperation({ summary: 'Get recent issued books' })
  @ApiResponse({ status: 200, description: 'Recent issued books retrieved successfully', type: [IssueBook] })
  async findRecent(@Query('limit') limit: string): Promise<{ message: string; issues: IssueBook[] }> {
    const recentIssues = await this.issuesService.findRecent(parseInt(limit) || 5);
    return { message: 'Recent issued books retrieved successfully', issues: recentIssues };
  }

   @Public()
   @Get('overdue/count')
  @ApiOperation({ summary: 'Get count of overdue books' })
  @ApiResponse({ status: 200, description: 'Overdue count retrieved successfully' })
  async getOverdueCount(): Promise<{ count: number }> {
    const count = await this.issuesService.getOverdueCount();
    return { count };
  }

   @Public()
   @Get('count')
  @ApiOperation({ summary: 'Get count of issues by date' })
  @ApiResponse({ status: 200, description: 'Issue count retrieved successfully' })
  async getIssuesCount(@Query('date') date: string): Promise<{ count: number }> {
    const count = await this.issuesService.getIssuesCount(date);
    return { count };
  }

   @Public()
   @Get('overdue')
  @ApiOperation({ summary: 'Get overdue issued books' })
  @ApiResponse({ status: 200, description: 'Overdue books retrieved successfully', type: [IssueBook] })
  async findOverdue(): Promise<{ message: string; data: IssueBook[]; count: number }> {
    const issues = await this.issuesService.findAll();
    const overdueIssues = issues.filter(issue => issue.status === 'Overdue');
    return { message: 'Overdue books retrieved successfully', data: overdueIssues, count: overdueIssues.length };
  }

   @Get(':id')
  @ApiOperation({ summary: 'Get issued book by ID' })
  @ApiResponse({ status: 200, description: 'Issued book retrieved successfully', type: IssueBook })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.findOne(id);
    return { message: 'Issued book retrieved successfully', data: issue };
  }

   @Put(':id')
  @ApiOperation({ summary: 'Update issued book' })
  @ApiResponse({ status: 200, description: 'Issued book updated successfully', type: IssueBook })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async update(@Param('id') id: string, @Body() updateIssueDto: any): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.update(id, updateIssueDto);
    return { message: 'Issued book updated successfully', data: issue };
  }

   @Put(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully', type: IssueBook })
  @ApiResponse({ status: 400, description: 'Book already returned' })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async returnBook(@Param('id') id: string): Promise<{ message: string; data: IssueBook; fine: any }> {
    const issue = await this.issuesService.returnBook(id);
    return {
      message: 'Book returned successfully',
      data: issue,
      fine: issue.fine > 0 ? { amount: issue.fine, daysOverdue: issue.daysOverdue, finePerDay: issue.finePerDay } : null,
    };
  }

   @Delete(':id')
  @ApiOperation({ summary: 'Delete issued book record' })
  @ApiResponse({ status: 200, description: 'Issued book record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.issuesService.remove(id);
    return { message: 'Issued book record deleted successfully' };
  }
}
