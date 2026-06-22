import { IsString, IsEnum, IsOptional, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty({ description: 'ID of the staff' })
  @IsMongoId()
  staffId: string;

  @ApiProperty({ description: 'Date in YYYY-MM-DD format' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Check-in time', required: false })
  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @ApiProperty({ description: 'Check-out time', required: false })
  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @ApiProperty({ description: 'Optional remarks', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
