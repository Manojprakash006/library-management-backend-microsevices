import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '../entities/book.entity';
import { BookReview, BookReviewDocument } from '../entities/book-review.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookReview.name) private bookReviewModel: Model<BookReviewDocument>,
    private readonly httpService: HttpService,
  ) { }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/activities/logs`, {
          adminId,
          action,
          entityType: 'BOOK',
          entityId,
          details
        })
      );
    } catch (error) {
      this.logger.error(`Failed to log activity to member service: ${error}`);
    }
  }

  private async notifyAdmins(type: string, title: string, message: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3002';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
          type,
          title,
          message
        })
      );
    } catch (error) {
      this.logger.error(`Failed to broadcast to admins: ${error}`);
    }
  }

  async create(createBookDto: CreateBookDto, adminId?: string, role?: string): Promise<Book> {
    const existingBook = await this.bookModel.findOne({ bookId: createBookDto.bookId }).exec();
    if (existingBook) {
      throw new ConflictException('Book ID already exists');
    }

    const createdBook = new this.bookModel({
      ...createBookDto,
      createdBy: adminId, // Set the staff/admin who created this book
    });
    const savedBook = await createdBook.save();

    if (adminId) {
      await this.logActivity(adminId, 'CREATE', savedBook.bookId, { title: savedBook.title });
      
      if (role === 'staff') {
        // Notify all admins that a requested action (book creation) happened
        await this.notifyAdmins(
          'NEW_BOOK_ADDED',
          'New Book Added to Library',
          `A new book "${savedBook.title}" (ID: ${savedBook.bookId}) has been successfully added to the catalog by staff.`
        );
      }
    }

    return savedBook;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      this.bookModel.find().skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

    const updatedBooks = await Promise.all(
      books.map(async (book) => {
        try {
          const issueResponse = await firstValueFrom( this.httpService.get(
              `${issuesServiceUrl}/issues/count/book/${book._id}`));

          const issuedCount = issueResponse.data?.count || 0;

          const reviews = await this.bookReviewModel.find({
            bookId: book._id,
          });

          const totalReviews = reviews.length;

          const rating =
            totalReviews > 0
              ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                totalReviews
              : 0;

          return {
            ...book.toObject(),
            available: book.quantity - issuedCount,
            totalReviews,
            rating: Number(rating.toFixed(1)),
          };

        } catch (error) {
          console.log("ERROR:", error);

          return {
            ...book.toObject(),
            available: book.quantity,
            totalReviews: 0,
            rating: 0,
          };
        }
      })
    );

    return {
      data: updatedBooks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<any> {
    const book = await this.bookModel.findById(id).exec();

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

    try {
      const response = await firstValueFrom( this.httpService.get(
          `${issuesServiceUrl}/issues/count/book/${book._id}`) );

      const issuedCount = response.data?.count || 0;

      return { ...book.toObject(), available: book.quantity - issuedCount };
    } catch (error) {
      console.log("ISSUE COUNT FETCH FAILED:", error);

      return { ...book.toObject(), available: book.quantity };
    }
  }

  async findByBookId(bookId: string): Promise<Book> {
    const book = await this.bookModel.findOne({ bookId }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto, adminId?: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (adminId) {
      await this.logActivity(adminId, 'UPDATE', book.bookId, { updatedFields: Object.keys(updateBookDto) });
    }

    return book;
  }

  async updateStatus(id: string, status: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    this.logger.log(`Book ${id} status updated to ${status}`);
    return book;
  }

  async remove(id: string, adminId?: string): Promise<void> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.status === 'issued') {
      throw new BadRequestException('Cannot delete a book that is currently issued. Please return the book first.');
    }

    await this.bookModel.findByIdAndDelete(id).exec();

    if (adminId) {
      await this.logActivity(adminId, 'DELETE', book.bookId, { title: book.title });
    }
  }

  async search(query: string): Promise<Book[]> {
    return this.bookModel.find({ $text: { $search: query } }).exec();
  }

  async findByCategory(category: string): Promise<Book[]> {
    return this.bookModel.find({ category }).exec();
  }

  async findByRack(rackNumber: string): Promise<Book[]> {
    return this.bookModel.find({ rackNumber }).exec();
  }

  async createReview(createReviewDto: CreateBookReviewDto): Promise<BookReview> {

    const existingReview = await this.bookReviewModel.findOne({
      bookId: new Types.ObjectId(createReviewDto.bookId),
      memberId: new Types.ObjectId(createReviewDto.memberId),
    }).exec();

    if (existingReview) {
      throw new ConflictException('Review already exists for this book by this member');
    }

    let memberName = "Member";

    try {
      const response = await firstValueFrom( this.httpService.get(
          `http://localhost:3000/api-gateway/library/members/${createReviewDto.memberId}`) );

      memberName = response.data?.name || "Member";

    } catch (error) {
      console.log("Failed to fetch member name:", error.message);
    }

    const review = new this.bookReviewModel({
      ...createReviewDto,
      bookId: new Types.ObjectId(createReviewDto.bookId),
      memberId: new Types.ObjectId(createReviewDto.memberId),
      memberName,
    });

    return review.save();
  }

  async findReviewsByBook(bookId: string): Promise<BookReview[]> {
    return this.bookReviewModel.find({ bookId: new Types.ObjectId(bookId) }).exec();
  }

  async toggleLike(reviewId: string, userId: string) {
    const review = await this.bookReviewModel.findById(reviewId);

    if (!review) throw new Error("Review not found");

    if(!userId) {
      throw new Error("User not Authenticated");
    }

    const alreadyLiked = review.likedBy.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      review.likedBy = review.likedBy.filter(id => id !== userId);
      review.likeCount = Math.max(0, review.likeCount -1);
    } else {
      review.likedBy.push(userId);
      review.likeCount += 1;
    }

    await review.save();
    return review;
  }

  async findReviewsByMember(memberId: string): Promise<BookReview[]> {
    return this.bookReviewModel.find({ memberId: new Types.ObjectId(memberId) }).sort({ reviewDate: -1 }).exec();
  }
}
