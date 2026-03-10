import { Controller, Get, Post, Body, Param, Version, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MemberBooksService } from '../service/member-books.service';
import { RequestBookDto } from '../dto/request-book.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Member Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('member')
@Controller('member-books')
export class MemberBooksController {
  constructor(private readonly memberBooksService: MemberBooksService) {}

   @Get('browse')
  @ApiOperation({ summary: 'Browse all available books' })
  async getAllBooks() {
    const result = await this.memberBooksService.getAllBooks();
    return { message: 'Books retrieved successfully', data: result, count: result.length };
  }

   @Get(':bookId')
  @ApiOperation({ summary: 'Get book by ID' })
  async getBookById(@Param('bookId') bookId: string) {
    const result = await this.memberBooksService.getBookById(bookId);
    return { message: 'Book retrieved successfully', data: result };
  }

   @Post('request')
  @ApiOperation({ summary: 'Request a book' })
  async requestBook(@Body() requestDto: RequestBookDto) {
    const result = await this.memberBooksService.requestBook(requestDto);
    return { message: 'Book requested successfully', data: result };
  }
}
