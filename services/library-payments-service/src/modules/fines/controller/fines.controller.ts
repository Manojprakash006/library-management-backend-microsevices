import { Controller, Get, Post, Param, Body, Query, UsePipes, ValidationPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FinesService } from '../service/fines.service';
import { PayFineDto } from '../dto/pay-fine.dto';
import { CreateFineDto } from '../dto/create-fine.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('fines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Get()
  @Get('all')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get all fines' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all fines.' })
  async getAllFines(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    const result = await this.finesService.getAllFines(pageNum, limitNum);
    return { 
      message: 'All fines retrieved successfully', 
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  @Get('member/:memberId')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get all fines for a member' })
  @ApiParam({ name: 'memberId', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all fines for the member.' })
  async getFinesByMemberId(@Param('memberId') memberId: string) {
    const data = await this.finesService.getFinesByMemberId(memberId);
    return { message: 'Fines retrieved successfully', data };
  }

  @Get(':id')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Get a fine by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the fine.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Fine not found.' })
  async getFineById(@Param('id') id: string) {
    const data = await this.finesService.getFineById(id);
    return { message: 'Fine retrieved successfully', data };
  }

  @Get('member/:memberId/pending-check')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Check pending fines for a member' })
  @ApiParam({ name: 'memberId', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return pending fines status.' })
  async checkPendingFines(@Param('memberId') memberId: string) {
    const data = await this.finesService.checkPendingFines(memberId);
    return { message: 'Pending fines retrieved successfully', data };
  }     

  // @Post('create')
  // @Roles('admin', 'staff')

  @Post('create')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Create a new fine' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Fine successfully created.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createFine(@Body() createFineDto: CreateFineDto) {
    const data = await this.finesService.createFine(createFineDto);
    return { message: 'Fine created successfully', data };
  }

  @Post(':id/pay')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Pay a fine' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fine successfully paid.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async payFine(@Param('id') id: string, @Body() payFineDto: PayFineDto) {
    const data = await this.finesService.payFine(id, payFineDto.paymentMethod, payFineDto.referenceId);
    return { message: 'Fine paid successfully', data };
  }

  @Post(':id/create-razorpay-order')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Create a Razorpay order for a fine' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Razorpay order created.' })
  async createRazorpayOrder(@Param('id') id: string) {
    const data = await this.finesService.createRazorpayOrder(id);
    return { message: 'Razorpay order created successfully', data };
  }

  @Post('verify-razorpay-payment')
  @Roles('admin', 'staff', 'member')
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment verified and fine updated.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyRazorpayPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    const data = await this.finesService.verifyRazorpayPayment(
      verifyPaymentDto.fineId,
      verifyPaymentDto.razorpayOrderId,
      verifyPaymentDto.razorpayPaymentId,
      verifyPaymentDto.signature,
    );
    return { message: 'Payment verified successfully', data };
  }
}

