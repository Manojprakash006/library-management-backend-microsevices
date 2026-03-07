import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';

interface RackInfo {
  rackNumber: string;
  location: string;
  totalBooks: number;
  available: number;
  issued: number;
  capacity: number;
  capacityPercentage?: string;
  books?: any[];
  recentBooks?: any[];
  booksByCategory?: Record<string, any[]>;
}

@Injectable()
export class RacksService {
  private readonly logger = new Logger(RacksService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async findAll(): Promise<RackInfo[]> {
    const books = await this.bookModel.find().exec();

    const rackMap: Record<string, RackInfo> = {};

    for (const book of books) {
      const rackNumber = book.rackNumber;

      if (!rackMap[rackNumber]) {
        rackMap[rackNumber] = {
          rackNumber: rackNumber,
          location: 'Main Hall',
          totalBooks: 0,
          available: 0,
          issued: 0,
          capacity: 50,
          recentBooks: [],
          books: [],
        };
      }

      // Calculate available count (simplified - assuming quantity is available)
      const availableCount = book.quantity || 0;
      const issuedCount = 0; // Would need IssueBook model for accurate count

      rackMap[rackNumber].totalBooks += 1;
      rackMap[rackNumber].available += availableCount > 0 ? 1 : 0;
      rackMap[rackNumber].issued += issuedCount > 0 ? 1 : 0;

      rackMap[rackNumber].books.push({
        _id: book._id,
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        category: book.category,
        shelfNumber: book.shelfNumber,
        quantity: book.quantity,
        available: availableCount,
        issued: issuedCount,
        status: availableCount > 0 ? 'Available' : 'Issued',
        coverUrl: book.coverUrl,
      });
    }

    // Add recent books summary
    for (const rackNumber in rackMap) {
      const rack = rackMap[rackNumber];
      rack.recentBooks = rack.books.slice(0, 3).map((b) => ({
        title: b.title,
        status: b.status,
      }));
    }

    return Object.values(rackMap);
  }

  async findByRackNumber(rackNumber: string): Promise<RackInfo> {
    const books = await this.bookModel.find({ rackNumber }).exec();

    if (books.length === 0) {
      throw new NotFoundException('Rack not found or has no books');
    }

    const rackData: RackInfo = {
      rackNumber: rackNumber,
      location: 'Main Hall',
      totalBooks: books.length,
      available: 0,
      issued: 0,
      capacity: 50,
      books: [],
      booksByCategory: {},
    };

    for (const book of books) {
      const availableCount = book.quantity || 0;
      const issuedCount = 0; // Would need IssueBook model

      rackData.available += availableCount > 0 ? 1 : 0;
      rackData.issued += issuedCount > 0 ? 1 : 0;

      const bookData = {
        _id: book._id,
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        category: book.category,
        shelfNumber: book.shelfNumber,
        quantity: book.quantity,
        available: availableCount,
        issued: issuedCount,
        status: availableCount > 0 ? 'Available' : 'Issued',
        coverUrl: book.coverUrl,
      };

      rackData.books.push(bookData);

      if (!rackData.booksByCategory![book.category]) {
        rackData.booksByCategory![book.category] = [];
      }
      rackData.booksByCategory![book.category].push(bookData);
    }

    rackData.capacityPercentage = ((rackData.totalBooks / rackData.capacity) * 100).toFixed(0);

    return rackData;
  }
}
