import { IsString, IsEmail, IsOptional, IsBoolean, MinLength, MaxLength, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '../entities/staff.entity';

export class CreateStaffDto {
  @ApiProperty({ description: 'Full name of the staff' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', minLength: 10, maxLength: 20 })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Password', minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: 'Department', default: 'General', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  department: string;

  @ApiProperty({ description: 'ID of the assigned shift' })
  @IsMongoId()
  shift: string;

  @ApiProperty({ description: 'Qualification', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  qualification: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address: string;

  @ApiProperty({ description: 'Emergency contact', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  emergencyContact: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole, required: false, default: 'staff' })
  @IsOptional()
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiProperty({ description: 'Staff designation', required: false, default: 'Staff' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation: string;

  @ApiProperty({ description: 'ID Proof Type', required: false })
  @IsOptional()
  @IsString()
  idProofType: string;

  @ApiProperty({ description: 'ID Proof Number', required: false })
  @IsOptional()
  @IsString()
  idProofNumber: string;

  @ApiProperty({ description: 'Photo URL', required: false })
  @IsOptional()
  @IsString()
  photoUrl: string;
}
