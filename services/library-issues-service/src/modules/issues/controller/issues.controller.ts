import { Controller, Get, Post, Put, Delete, Body, Param, Version, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IssuesService } from '../service/issues.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { IssueBook, IssueStatus } from '../entities/issue-book.entity';
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
  constructor(private readonly issuesService: IssuesService) { }

  @Post()
  @ApiOperation({ summary: 'Issue a book' })
  @ApiResponse({ status: 201, description: 'Book issued successfully', type: IssueBook })
  async create(@Body() createIssueDto: CreateIssueDto, @Req() req: any): Promise<{ message: string; data: IssueBook }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const authHeader = req.headers.authorization;
    const issue = await this.issuesService.create(createIssueDto, adminId, authHeader);
    return { message: 'Book issued successfully', data: issue };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all issued books' })
  @ApiResponse({ status: 200, description: 'Issued books retrieved successfully', type: [IssueBook] })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    const result = await this.issuesService.findAll(pageNum, limitNum, status);
    return { 
      message: 'Issued books retrieved successfully', 
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  @Public()
  @Get('member/:memberId/stats')
  @ApiOperation({ summary: 'Get member issue stats by type' })
  @ApiResponse({ status: 200, description: 'Member stats retrieved successfully' })
  async getMemberStats(@Param('memberId') memberId: string): Promise<{
    message: string;
    data: {
      booksAtHome: number;
      readingInsideLibrary: number;
      totalActive: number;
    }
  }> {
    const issues = await this.issuesService.findActiveByMember(memberId);

    const booksAtHome = issues.filter(issue => 
      issue.issueType?.toLowerCase() === 'taking home'
    ).length;
    const readingInsideLibrary = issues.filter(issue => 
      issue.issueType?.toLowerCase() === 'reading inside library'
    ).length;

    return {
      message: 'Member stats retrieved successfully',
      data: {
        booksAtHome,
        readingInsideLibrary,
        totalActive: issues.length
      }
    };
  }

  @Public()
  @Get('member/:memberId')
  @ApiOperation({ summary: 'Get issued books by member ID' })
  @ApiResponse({ status: 200, description: 'Issued books retrieved successfully', type: [IssueBook] })
  async findIssuedByMember(@Param('memberId') memberId: string): Promise<{ message: string; data: IssueBook[]; count: number }> {
    const issues = await this.issuesService.findByMember(memberId);
    return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
  }

  @Public()
  @Get('member/:memberId/active')
  @ApiOperation({ summary: 'Get active borrowed books (including overdue)' })
  async findActiveByMember(@Param('memberId') memberId: string) {
    const issues = await this.issuesService.findActiveByMember(memberId);
    return {
      message: 'Active borrowed books retrieved successfully',
      data: issues,
      count: issues.length,  
    };
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
  @Get('returns/count')
  @ApiOperation({ summary: 'Get count of returned books' })
  @ApiResponse({ status: 200, description: 'Returns count retrieved successfully' })
  async getReturnsCount(@Query('date') date: string): Promise<{ count: number }> {
    const count = await this.issuesService.getReturnsCount(date);
    return { count };
  }

  @Public()
  @Get('count/book/:bookId')
  @ApiOperation({ summary: 'Get count of active issues for a specific book' })
  @ApiResponse({ status: 200, description: 'Book issue count retrieved successfully' })
  async getBookIssueCount(@Param('bookId') bookId: string): Promise<{ count: number }> {
    const count = await this.issuesService.getBookIssueCount(bookId);
    return { count };
  }

  @Public()
  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue issued books' })
  @ApiResponse({ status: 200, description: 'Overdue books retrieved successfully', type: [IssueBook] })
  async findOverdue(): Promise<{ message: string; data: IssueBook[]; count: number }> {
    const result = await this.issuesService.findAll(1, 1000); // Fetch a large set for overdue check
    const overdueIssues = result.data.filter(issue => issue.status === IssueStatus.OVERDUE);
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
  async update(@Param('id') id: string, @Body() updateIssueDto: any, @Req() req: any): Promise<{ message: string; data: IssueBook }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const issue = await this.issuesService.update(id, updateIssueDto, adminId);
    return { message: 'Issued book updated successfully', data: issue };
  }

  @Put(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully', type: IssueBook })
  @ApiResponse({ status: 400, description: 'Book already returned' })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async returnBook(@Param('id') id: string, @Req() req: any): Promise<{ message: string; data: IssueBook; fine: any }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const authHeader = req.headers.authorization;
    const issue = await this.issuesService.returnBook(id, adminId, authHeader);
    return {
      message: 'Book returned successfully',
      data: issue,
      fine: issue.fine > 0 ? { amount: issue.fine, daysOverdue: issue.daysOverdue, finePerDay: issue.finePerDay } : null,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Get Member Read Books Count'})
  @Get('member/:memberId/completed-count')
  async getCompletedCount(@Param('memberId') memberId: string) {
    const count = await this.issuesService.getCompletedCount(memberId);
    return { count };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete issued book record' })
  @ApiResponse({ status: 200, description: 'Issued book record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<{ message: string }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    await this.issuesService.remove(id, adminId);
    return { message: 'Issued book record deleted successfully' };
  }
}
