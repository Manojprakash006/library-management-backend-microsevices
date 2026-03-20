import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Version, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from '../service/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
import { Book } from '../entities/book.entity';
import { BookReview } from '../entities/book-review.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Public } from '../../../auth/guards/public.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'staff')
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully', type: Book })
  @ApiResponse({ status: 409, description: 'Book ID already exists' })
  async create(@Body() createBookDto: CreateBookDto, @Req() req: any): Promise<{ message: string; data: Book }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const book = await this.booksService.create(createBookDto, adminId);
    return { message: 'Book created successfully', data: book };
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully', type: [Book] })
  async findAll(): Promise<{ message: string; data: Book[]; count: number }> {
    const books = await this.booksService.findAll();
    return { message: 'Books retrieved successfully', data: books, count: books.length };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books by text' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Book] })
  async search(@Query('q') query: string): Promise<{ message: string; data: Book[]; count: number }> {
    const books = await this.booksService.search(query);
    return { message: 'Search results', data: books, count: books.length };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get books by category' })
  @ApiResponse({ status: 200, description: 'Books by category', type: [Book] })
  async findByCategory(@Param('category') category: string): Promise<{ message: string; data: Book[]; count: number }> {
    const books = await this.booksService.findByCategory(category);
    return { message: 'Books by category retrieved successfully', data: books, count: books.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: Book }> {
    const book = await this.booksService.findOne(id);
    return { message: 'Book retrieved successfully', data: book };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Req() req: any): Promise<{ message: string; data: Book }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    const book = await this.booksService.update(id, updateBookDto, adminId);
    return { message: 'Book updated successfully', data: book };
  }

  @Public()
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update book status' })
  @ApiResponse({ status: 200, description: 'Book status updated successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<{ message: string; data: Book }> {
    const book = await this.booksService.updateStatus(id, status);
    return { message: 'Book status updated successfully', data: book };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<{ message: string }> {
    const adminId = req.user?.id || req.user?.userId || 'SYSTEM';
    await this.booksService.remove(id, adminId);
    return { message: 'Book deleted successfully' };
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create a book review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: BookReview })
  @ApiResponse({ status: 409, description: 'Review already exists' })
  async createReview(@Body() createReviewDto: CreateBookReviewDto): Promise<{ message: string; data: BookReview }> {
    const review = await this.booksService.createReview(createReviewDto);
    return { message: 'Review created successfully', data: review };
  }

  @Get('reviews/:bookId')
  @ApiOperation({ summary: 'Get reviews by book ID' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully', type: [BookReview] })
  async findReviewsByBook(@Param('bookId') bookId: string): Promise<{ message: string; data: BookReview[]; count: number }> {
    const reviews = await this.booksService.findReviewsByBook(bookId);
    return { message: 'Reviews retrieved successfully', data: reviews, count: reviews.length };
  }
}
