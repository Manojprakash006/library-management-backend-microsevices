import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { ConfigService } from '../../library-config/service/config.service';
import { error } from 'console';

interface ShelfInfo {
  shelfNumber: string;
  totalBooks: number;
  totalQuantity: number;
  capacity: number;
}

interface RackInfo {
  rackNumber: string;
  location: string;
  totalBooks: number; // Unique titles count
  totalQuantity: number; // Sum of all copies
  available: number;
  issued: number;
  capacity: number;
  capacityPercentage?: string;
  shelves?: Record<string, ShelfInfo>;
  books?: any[];
  recentBooks?: any[];
  booksByCategory?: Record<string, any[]>;
  damagedQuantity: number;
}

@Injectable()
export class RacksService {
  private readonly logger = new Logger(RacksService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<RackInfo[]> {
    const books = await this.bookModel.find().lean().select('+damagedQuantity');
    const config = await this.configService.getConfig();
    const maxRackCapacity = config?.maxRackCapacity || 50;
    const maxShelfCapacity = config?.maxShelfCapacity || 10;

    const rackMap: Record<string, RackInfo> = {};

    for (const book of books) {
      const rackNumber = book.rackNumber;

      if (!rackMap[rackNumber]) {
        rackMap[rackNumber] = {
          rackNumber: rackNumber,
          location: 'Main Hall',
          totalBooks: 0,
          totalQuantity: 0,
          available: 0,
          issued: 0,
          capacity: maxRackCapacity,
          shelves: {},
          recentBooks: [],
          books: [],
          damagedQuantity: 0,
        };
      }

      // Fetch actual issued count from Issues service
      const issuedCount = await this.getIssuedCountForBook(book._id.toString());
      const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);

      rackMap[rackNumber].totalBooks += 1;
      rackMap[rackNumber].totalQuantity += (book.quantity || 0);
      rackMap[rackNumber].damagedQuantity += (book.damagedQuantity || 0);
      
      const shelfNumber = book.shelfNumber || 'S1';
      if (!rackMap[rackNumber].shelves![shelfNumber]) {
        rackMap[rackNumber].shelves![shelfNumber] = {
          shelfNumber,
          totalBooks: 0,
          totalQuantity: 0,
          capacity: maxShelfCapacity,
        };
      }
      rackMap[rackNumber].shelves![shelfNumber].totalBooks += 1;
      rackMap[rackNumber].shelves![shelfNumber].totalQuantity += (book.quantity || 0);

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
        damagedQuantity: book.damagedQuantity ?? 0,
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
    console.log('New code running');
    const books = await this.bookModel.find({ rackNumber }).lean().select('+damagedQuantity');
    const config = await this.configService.getConfig();
    const maxRackCapacity = config?.maxRackCapacity || 50;
    const maxShelfCapacity = config?.maxShelfCapacity || 10;

    if (books.length === 0) {
      throw new NotFoundException('Rack not found or has no books');
    }

    const rackData: RackInfo = {
      rackNumber: rackNumber,
      location: 'Main Hall',
      totalBooks: books.length,
      totalQuantity: 0,
      available: 0,
      issued: 0,
      capacity: maxRackCapacity,
      shelves: {},
      books: [],
      booksByCategory: {},
      damagedQuantity: 0,
    };

    for (const book of books) {
      console.log('RAW BOOK from DB :', book);
      
      const issuedCount = await this.getIssuedCountForBook(book._id.toString());
      const availableCount = Math.max(0, (book.quantity || 0) - issuedCount);

      rackData.totalQuantity += (book.quantity || 0);
      rackData.damagedQuantity += (book.damagedQuantity || 0);

      const shelfNumber = book.shelfNumber || 'S1';
      if (!rackData.shelves![shelfNumber]) {
        rackData.shelves![shelfNumber] = {
          shelfNumber,
          totalBooks: 0,
          totalQuantity: 0,
          capacity: maxShelfCapacity,
        };
      }
      rackData.shelves![shelfNumber].totalBooks += 1;
      rackData.shelves![shelfNumber].totalQuantity += (book.quantity || 0);

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
        damagedQuantity: book.damagedQuantity || 0,
        available: availableCount,
        issued: issuedCount,
        status: availableCount > 0 ? 'Available' : 'Issued',
        coverUrl: book.coverUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      };
      console.log('Book Data :', bookData);

      rackData.books.push(bookData);

      if (!rackData.booksByCategory![book.category]) {
        rackData.booksByCategory![book.category] = [];
      }
      rackData.booksByCategory![book.category].push(bookData);
    }

    rackData.capacityPercentage = ((rackData.totalQuantity / rackData.capacity) * 100).toFixed(0);

    return rackData;
  }
}
