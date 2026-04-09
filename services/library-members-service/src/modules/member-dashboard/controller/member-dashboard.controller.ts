import { Controller, Get, Post, Body, Param, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MemberDashboardService } from '../service/member-dashboard.service';
import { ReportDamageDto } from '../dto/report-damage.dto';
import { RenewBookDto } from '../dto/renew-book.dto';
import { SubmitReviewDto } from '../dto/submit-review.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Member Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('member')
@Controller('member-dashboard')
export class MemberDashboardController {
  constructor(private readonly memberDashboardService: MemberDashboardService) {}

   @Get('stats')
  @ApiOperation({ summary: 'Get member dashboard stats' })
  async getMemberStats(@Request() req: any) {
    const result = await this.memberDashboardService.getDashboardStats(req.user.id);
    return { message: 'Stats retrieved successfully', data: result };
  }

   @Get('overdue-books')
  @ApiOperation({ summary: 'Get overdue books' })
  async getOverdueBooks(@Request() req: any) {
    const result = await this.memberDashboardService.getOverdueBooks(req.user.id);
    return { message: 'Overdue books retrieved', data: result };
  }

   @Get('recent-requests')
  @ApiOperation({ summary: 'Get recent book requests' })
  async getRecentRequests(@Request() req: any) {
    const result = await this.memberDashboardService.getRecentRequests(req.user.id);
    return { message: 'Recent requests retrieved', data: result };
  }

   @Get('borrowed-books')
  @ApiOperation({ summary: 'Get currently borrowed books' })
  async getCurrentlyBorrowedBooks(@Request() req: any) {
    const result = await this.memberDashboardService.getCurrentlyBorrowedBooks(req.user.id);
    return { message: 'Borrowed books retrieved', data: result };
  }

   @Get('book-details/:issueId')
  @ApiOperation({ summary: 'Get book details by issue ID' })
  async getBookDetails(@Param('issueId') issueId: string) {
    const result = await this.memberDashboardService.getBookDetails(issueId);
    return { message: 'Book details retrieved', data: result };
  }

   @Get('my-books')
  @ApiOperation({ summary: 'Get my books' })
  async getMyBooks(@Request() req: any) {
    console.log("REQ USER for my-books:", req.user);
    const result = await this.memberDashboardService.getMyBooks(req.user.userId);
    return { message: 'My books retrieved', data: result };
  }

   @Post('report-damage')
  @ApiOperation({ summary: 'Report book damage' })
  async reportBookDamage(@Body() damageDto: ReportDamageDto) {
    const result = await this.memberDashboardService.reportBookDamage(damageDto);
    return { message: 'Damage report submitted', data: result };
  }

   @Post('renew-book')
  @ApiOperation({ summary: 'Renew a book' })
  async renewBook(@Body() renewDto: RenewBookDto) {
    const result = await this.memberDashboardService.renewBook(renewDto);
    return { message: 'Book renewal requested', data: result };
  }

   @Post('submit-review')
  @ApiOperation({ summary: 'Submit a book review' })
  async submitReview(@Request() req: any, @Body() reviewDto: SubmitReviewDto) {
    const result = await this.memberDashboardService.submitReview(req.user.id, reviewDto);
    return { message: 'Review submitted', data: result };
  }
}
