import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Version, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
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
@Roles('admin', 'staff', 'member')
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
    const role = req.user?.role;
    const book = await this.booksService.create(createBookDto, adminId, role);
    return { message: 'Book created successfully', data: book };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully', type: [Book] })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ message: string; data: Book[]; total: number; page: number; limit: number; totalPages: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    const result = await this.booksService.findAll(pageNum, limitNum);
    return { 
      message: 'Books retrieved successfully', 
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
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

  @Public()
  @Get('/check')
  async checkReview (
      @Query('bookId') bookId: string,
      @Query('memberId') memberId: string,
    ) {
      return this.booksService.checkReview(bookId, memberId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string): Promise<{ message: string; data: Book }> {
    const book = await this.booksService.findOne(id);
    return { message: 'Book retrieved successfully', data: book };
  }
  
  @Public()
  @Get(':bookId/reviews')
  @ApiOperation({ summary: 'Get reviews by book ID' })
  async getReviewsByBook(@Param('bookId') bookId: string) {
    const reviews = await this.booksService.findReviewsByBook(bookId);
    return {
      message: 'Reviews fetched successfully',
      data: reviews,
    };
  }

  @Post(':reviewId/like')
  toggleLike(
    @Param('reviewId') reviewId: string,
    @Req() req
  ) {
    const userId = req.user?.id || req.user?.userId;
    if(!userId) {
      throw new Error("User not Authenticated");
    }
    return this.booksService.toggleLike(reviewId, userId);
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
  async createReview(@Body() createReviewDto: CreateBookReviewDto,
    @Req() req:any): Promise<{ message: string; data: BookReview }> {
      const user = req.user;
      const token = req.headers.authorization;
      const review = await this.booksService.createReview({
        ...createReviewDto,
        memberId: user.id,
      }, token);
      return { message: 'Review created successfully', data: review };
  }

  @Get('my-reviews/:userId')
  async getMyReviews(@Param('userId') userId: string) {
    const reviews = await this.booksService.findReviewsByUser(userId);
    return {
      message: 'My reviews fetched',
      data: reviews,
    };
  }

  @Put('reviews/:reviewId')
  @ApiOperation({ summary: 'Update a book review' })
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateData: any,
    @Req() req: any
  ) {
    const userId = req.user?.id;
    const updated = await this.booksService.updateReview(
      reviewId,
      userId,
      updateData
    );
    return {
      message: 'Review updated successfully',
      data: updated,
    };
  }

  @Delete('reviews/:reviewId')
  @ApiOperation({ summary: 'Delete a book review' })
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Req() req: any
  ) {
    const userId = req.user?.id || req.user?.userId;
    const role = req.user?.role;
    try {
      await this.booksService.deleteReview(reviewId, userId, role);
      return {
        message: 'Review deleted successfully',
      };
    } catch (error) {
      if (error.message === 'Review not found') {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException(error.message);
    }
  }

}
