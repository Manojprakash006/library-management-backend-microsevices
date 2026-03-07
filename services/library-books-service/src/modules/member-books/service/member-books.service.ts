import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { RequestBookDto } from '../dto/request-book.dto';

@Injectable()
export class MemberBooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async getAllBooks() {
    return this.bookModel.find({ status: 'available' }).select('-__v');
  }

  async getBookById(bookId: string) {
    const book = await this.bookModel.findById(bookId).select('-__v');
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async requestBook(requestDto: RequestBookDto) {
    const book = await this.bookModel.findById(requestDto.bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    
    return {
      message: 'Book request submitted',
      bookId: requestDto.bookId,
      memberId: requestDto.memberId,
      status: 'pending',
    };
  }
}
