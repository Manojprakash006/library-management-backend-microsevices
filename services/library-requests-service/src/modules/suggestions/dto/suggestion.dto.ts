import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { SuggestionStatus } from '../entities/book-suggestion.entity';

export class CreateSuggestionDto {
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  loggedBy?: string;
}

export class UpdateSuggestionStatusDto {
  @IsNotEmpty()
  @IsEnum(SuggestionStatus)
  status: SuggestionStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
