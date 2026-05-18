import { IsString, IsEnum, IsDateString, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeaveType } from '../entities/leave-request.entity';

export class CreateLeaveRequestDto {
  @ApiProperty({ description: 'ID of the staff applying for leave' })
  @IsMongoId()
  staffId: string;

  @ApiProperty({ description: 'Type of leave', enum: LeaveType })
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @ApiProperty({ description: 'Start date of leave' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of leave' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Reason for leave' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Hours for permission', required: false })
  @IsOptional()
  permissionHours?: number;

  @ApiProperty({ description: 'Time for permission', required: false })
  @IsOptional()
  @IsString()
  permissionTime?: string;

  @ApiProperty({ description: 'From time for permission', required: false })
  @IsOptional()
  @IsString()
  fromTime?: string;

  @ApiProperty({ description: 'To time for permission', required: false })
  @IsOptional()
  @IsString()
  toTime?: string;
}

export class UpdateLeaveStatusDto {
  @ApiProperty({ description: 'New status of the leave request', enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @ApiProperty({ description: 'ID of the admin approving/rejecting' })
  @IsMongoId()
  adminId: string;

  @ApiProperty({ description: 'Remarks from admin', required: false })
  @IsOptional()
  @IsString()
  adminRemarks?: string;
}
