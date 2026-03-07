import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestBookDto {
  @ApiProperty({ description: 'Book ID' })
  @IsString()
  bookId: string;

  @ApiProperty({ description: 'Member ID' })
  @IsString()
  memberId: string;
}
