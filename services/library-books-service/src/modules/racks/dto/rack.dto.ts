import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RackDto {
  @ApiProperty({ description: 'Rack number' })
  @IsString()
  rackNumber: string;

  @ApiProperty({ description: 'Location in library' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Total books in rack' })
  totalBooks: number;

  @ApiProperty({ description: 'Available books count' })
  available: number;

  @ApiProperty({ description: 'Issued books count' })
  issued: number;

  @ApiProperty({ description: 'Rack capacity' })
  capacity: number;

  @ApiProperty({ description: 'Capacity percentage', required: false })
  @IsOptional()
  capacityPercentage?: string;

  @ApiProperty({ description: 'Books in rack', required: false })
  @IsOptional()
  books?: any[];

  @ApiProperty({ description: 'Recent books summary', required: false })
  @IsOptional()
  recentBooks?: any[];

  @ApiProperty({ description: 'Books grouped by category', required: false })
  @IsOptional()
  booksByCategory?: Record<string, any[]>;
}
