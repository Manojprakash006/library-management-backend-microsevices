import { Controller, Get, Post, Put, Delete, Body, Param, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IssuesService } from '../service/issues.service';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { IssueBook } from '../entities/issue-book.entity';

@ApiBearerAuth()
@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Issue a book' })
  @ApiResponse({ status: 201, description: 'Book issued successfully', type: IssueBook })
  async create(@Body() createIssueDto: CreateIssueDto): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.create(createIssueDto);
    return { message: 'Book issued successfully', data: issue };
  }

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get all issued books' })
  @ApiResponse({ status: 200, description: 'Issued books retrieved successfully', type: [IssueBook] })
  async findAll(): Promise<{ message: string; data: IssueBook[]; count: number }> {
    const issues = await this.issuesService.findAll();
    return { message: 'Issued books retrieved successfully', data: issues, count: issues.length };
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get issued book by ID' })
  @ApiResponse({ status: 200, description: 'Issued book retrieved successfully', type: IssueBook })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.findOne(id);
    return { message: 'Issued book retrieved successfully', data: issue };
  }

  @Version('1')
  @Put(':id')
  @ApiOperation({ summary: 'Update issued book' })
  @ApiResponse({ status: 200, description: 'Issued book updated successfully', type: IssueBook })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async update(@Param('id') id: string, @Body() updateIssueDto: any): Promise<{ message: string; data: IssueBook }> {
    const issue = await this.issuesService.update(id, updateIssueDto);
    return { message: 'Issued book updated successfully', data: issue };
  }

  @Version('1')
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

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete issued book record' })
  @ApiResponse({ status: 200, description: 'Issued book record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Issued book not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.issuesService.remove(id);
    return { message: 'Issued book record deleted successfully' };
  }
}
