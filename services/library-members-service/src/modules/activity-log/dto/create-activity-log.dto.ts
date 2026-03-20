import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateActivityLogDto {
  @IsString()
  @IsNotEmpty()
  adminId: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  entityType: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
