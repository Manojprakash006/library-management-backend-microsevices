import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
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
    private readonly httpService: HttpService,
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

      // Fetch actual issued count from Issues service
      const issuedCount = await this.getIssuedCountForBook(book._id.toString());
      const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);

      rackMap[rackNumber].totalBooks += 1;
      rackMap[rackNumber].available += availableCount > 0 ? 1 : 0;
      rackMap[rackNumber].issued += issuedCount > 0 ? 1 : 0;

      rackMap[rackNumber].books.push({
        _id: book._id,
        bookId: book.bookId,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishYear: book.publishYear,
        category: book.category,
        edition: book.edition,
        language: book.language,
        pages: book.pages,
        price: book.price,
        rackNumber: book.rackNumber,
        shelfNumber: book.shelfNumber,
        bookType: book.bookType,
        condition: book.condition,
        description: book.description,
        quantity: book.quantity,
        available: availableCount,
        issued: issuedCount,
        status: availableCount > 0 ? 'Available' : 'Issued',
        coverUrl: book.coverUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      });
    }

    // Add recent books summary
    for (const rackNumber in rackMap) {
      const rack = rackMap[rackNumber];
      rack.recentBooks = rack.books.slice(0, 3).map((b) => ({
        title: b.title,
        status: b.status,
        available: b.available,
        issued: b.issued,
      }));
    }

    return Object.values(rackMap);
  }

  private async getIssuedCountForBook(bookId: string): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3002';
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count/book/${bookId}`)
      );
      return response.data?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to fetch issued count for book ${bookId}: ${error.message}`);
      return 0;
    }
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
      const issuedCount = await this.getIssuedCountForBook(book._id.toString());
      const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);

      rackData.available += availableCount > 0 ? 1 : 0;
      rackData.issued += issuedCount > 0 ? 1 : 0;

      const bookData = {
        _id: book._id,
        bookId: book.bookId,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishYear: book.publishYear,
        category: book.category,
        edition: book.edition,
        language: book.language,
        pages: book.pages,
        price: book.price,
        rackNumber: book.rackNumber,
        shelfNumber: book.shelfNumber,
        bookType: book.bookType,
        condition: book.condition,
        description: book.description,
        quantity: book.quantity,
        available: availableCount,
        issued: issuedCount,
        status: availableCount > 0 ? 'Available' : 'Issued',
        coverUrl: book.coverUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
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
