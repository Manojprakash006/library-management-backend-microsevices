import { Controller, Get, Post, Put, Delete, Body, Param, Version, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MemberHistoryService } from '../service/member-history.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { RequestBookAgainDto } from '../dto/request-book-again.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Member History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('member')
@Controller('member-history')
export class MemberHistoryController {
  constructor(private readonly memberHistoryService: MemberHistoryService) {}

  @Version('1')
  @Get('history')
  @ApiOperation({ summary: 'Get member borrowing history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getMemberHistory(@Request() req: any) {
    const result = await this.memberHistoryService.getMemberHistory(req.user.userId);
    return { message: 'History retrieved successfully', data: result };
  }

  @Version('1')
  @Post('request-again')
  @ApiOperation({ summary: 'Request book again' })
  @ApiResponse({ status: 201, description: 'Book request submitted' })
  async requestBookAgain(@Request() req: any, @Body() requestDto: RequestBookAgainDto) {
    const result = await this.memberHistoryService.requestBookAgain(req.user.userId, requestDto);
    return { message: 'Book request submitted', data: result };
  }

  @Version('1')
  @Get('reviews')
  @ApiOperation({ summary: 'Get member reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getMemberReviews(@Request() req: any) {
    const result = await this.memberHistoryService.getMemberReviews(req.user.userId);
    return { message: 'Reviews retrieved successfully', data: result };
  }

  @Version('1')
  @Post('reviews')
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async createReview(@Request() req: any, @Body() reviewDto: CreateReviewDto) {
    const result = await this.memberHistoryService.createReview(req.user.userId, reviewDto);
    return { message: 'Review created successfully', data: result };
  }

  @Version('1')
  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  async updateReview(@Param('id') id: string, @Body() reviewDto: UpdateReviewDto) {
    const result = await this.memberHistoryService.updateReview(id, reviewDto);
    return { message: 'Review updated successfully', data: result };
  }

  @Version('1')
  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  async deleteReview(@Param('id') id: string) {
    await this.memberHistoryService.deleteReview(id);
    return { message: 'Review deleted successfully' };
  }
}
