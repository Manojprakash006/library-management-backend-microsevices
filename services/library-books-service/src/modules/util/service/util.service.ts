import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';

@Injectable()
export class UtilService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async clearAll(): Promise<{ message: string }> {
    await this.bookModel.deleteMany({});
    return { message: 'All books deleted' };
  }
}
