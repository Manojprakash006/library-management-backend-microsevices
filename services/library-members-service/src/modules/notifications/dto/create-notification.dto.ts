import { IsString, IsOptional, IsBoolean, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Member ID reference' })
  @IsMongoId()
  memberId: string;
   
  @ApiProperty({ description: 'Issue ID reference', required: false })
  @IsOptional()
  @IsMongoId()
  issueId?: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Member email for email notification', required: false })
  @IsOptional()
  @IsString()
  memberEmail?: string;

  @ApiProperty({ description: 'Member name for email notification', required: false })
  @IsOptional()
  @IsString()
  memberName?: string;
}

export class UpdateNotificationDto {
  @ApiProperty({ description: 'Read status', required: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
