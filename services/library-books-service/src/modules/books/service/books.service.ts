import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '../entities/book.entity';
import { BookReview, BookReviewDocument } from '../entities/book-review.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookReviewDto } from '../dto/create-book-review.dto';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookReview.name) private bookReviewModel: Model<BookReviewDocument>,
  ) { }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookModel.findOne({ bookId: createBookDto.bookId }).exec();
    if (existingBook) {
      throw new ConflictException('Book ID already exists');
    }

    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findByBookId(bookId: string): Promise<Book> {
    const book = await this.bookModel.findOne({ bookId }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
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

  async remove(id: string): Promise<void> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.status === 'issued') {
      throw new BadRequestException('Cannot delete a book that is currently issued. Please return the book first.');
    }

    await this.bookModel.findByIdAndDelete(id).exec();
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

    const review = new this.bookReviewModel({
      ...createReviewDto,
      bookId: new Types.ObjectId(createReviewDto.bookId),
      memberId: new Types.ObjectId(createReviewDto.memberId),
    });

    return review.save();
  }

  async findReviewsByBook(bookId: string): Promise<BookReview[]> {
    return this.bookReviewModel.find({ bookId: new Types.ObjectId(bookId) }).exec();
  }

  async findReviewsByMember(memberId: string): Promise<BookReview[]> {
    return this.bookReviewModel.find({ memberId: new Types.ObjectId(memberId) }).sort({ reviewDate: -1 }).exec();
  }
}
