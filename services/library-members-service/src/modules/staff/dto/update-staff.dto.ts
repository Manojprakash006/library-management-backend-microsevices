import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsEmail, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StaffRole, StaffStatus } from '../entities/staff.entity';

export class UpdateStaffDto {
  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Password', minLength: 6, maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;

  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: 'Department', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  department?: string;

  @ApiProperty({ description: 'ID of the assigned shift', required: false })
  @IsOptional()
  @IsMongoId()
  shift?: string;

  @ApiProperty({ description: 'Status', enum: StaffStatus, required: false })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({ description: 'Role', enum: StaffRole, required: false })
  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;

  @ApiProperty({ description: 'Qualification', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  qualification?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty({ description: 'Emergency contact', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  emergencyContact?: string;

  @ApiProperty({ description: 'Staff designation', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string;

  @ApiProperty({ description: 'ID Proof Type', required: false })
  @IsOptional()
  @IsString()
  idProofType?: string;

  @ApiProperty({ description: 'ID Proof Number', required: false })
  @IsOptional()
  @IsString()
  idProofNumber?: string;

  @ApiProperty({ description: 'Photo URL', required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
