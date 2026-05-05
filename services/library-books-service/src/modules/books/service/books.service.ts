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
import { ConfigService } from '../../library-config/service/config.service';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookReview.name) private bookReviewModel: Model<BookReviewDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisEmitter: RedisEmitterService,
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

  private async validateStorageCapacity(rackNumber: string, shelfNumber: string, additionalQuantity: number, excludeBookId?: string): Promise<void> {
    if (!rackNumber) return;

    const query: any = { rackNumber };
    if (excludeBookId) {
      query._id = { $ne: excludeBookId };
    }

    const booksInRack = await this.bookModel.find(query).exec();
    const config = await this.configService.getConfig();
    
    // Validate Rack Total
    const currentRackTotal = booksInRack.reduce((sum, book) => sum + (book.quantity || 0), 0);
    const MAX_RACK_CAPACITY = config?.maxRackCapacity || 50;
    if (currentRackTotal + additionalQuantity > MAX_RACK_CAPACITY) {
      throw new BadRequestException(`Rack ${rackNumber} capacity exceeded (${currentRackTotal + additionalQuantity}/${MAX_RACK_CAPACITY}).`);
    }

    // Validate Shelf Total
    if (shelfNumber) {
      const currentShelfTotal = booksInRack
        .filter(b => b.shelfNumber === shelfNumber)
        .reduce((sum, book) => sum + (book.quantity || 0), 0);
      
      const MAX_SHELF_CAPACITY = config?.maxShelfCapacity || 10;
      if (currentShelfTotal + additionalQuantity > MAX_SHELF_CAPACITY) {
        throw new BadRequestException(`Shelf ${shelfNumber} in Rack ${rackNumber} is full (${currentShelfTotal + additionalQuantity}/${MAX_SHELF_CAPACITY}).`);
      }
    }
  }

  async create(createBookDto: CreateBookDto, adminId?: string, role?: string): Promise<Book> {
    // Force auto-generate bookId
    const count = await this.bookModel.countDocuments().exec();
    createBookDto.bookId = `BK-${count + 1}`;

    // Validate Rack & Shelf Capacity
    if (createBookDto.rackNumber) {
      await this.validateStorageCapacity(
        createBookDto.rackNumber, 
        createBookDto.shelfNumber || 'S1', 
        createBookDto.quantity || 1
      );
    }

    const createdBook = new this.bookModel({
      ...createBookDto,
      createdBy: adminId, // Set the staff/admin who created this book
    });
    const savedBook = await createdBook.save();

    if (adminId) {
      await this.logActivity(adminId, 'BOOKSADDED', savedBook.bookId, { title: savedBook.title });
      
      if (role === 'staff') {
        // Notify all admins that a requested action (book creation) happened
        await this.notifyAdmins(
          'NEW_BOOK_ADDED',
          'New Book Added to Library',
          `A new book "${savedBook.title}" (ID: ${savedBook.bookId}) has been successfully added to the catalog by staff.`
        );
      }
    }

    // Emit real-time event
    await this.redisEmitter.emit('BOOK_CREATED', savedBook);
    await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'create', book: savedBook });

    return savedBook;
  }

  async findAll(page: number = 1, limit: number = 10, search: string = ''): Promise<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { isbn: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [books, total] = await Promise.all([
      this.bookModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean().exec(),
      this.bookModel.countDocuments(query).exec(),
    ]);

    const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

    // Fetch availability in bulk to solve N+1 problem
    const bookIds = books.map(b => b._id.toString());
    let availabilityMap: Record<string, number> = {};
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${issuesServiceUrl}/issues/bulk-book-counts`, { bookIds })
      );
      availabilityMap = response.data?.counts || {};
    } catch (error) {
      this.logger.error(`Failed to fetch bulk availability: ${error.message}`);
    }

    // Fetch review counts in bulk
    let reviewCountsMap: Record<string, number> = {};
    try {
      const reviewCounts = await this.bookReviewModel.aggregate([
        { $match: { bookId: { $in: bookIds.map(id => new Types.ObjectId(id)) } } },
        { $group: { _id: '$bookId', count: { $sum: 1 } } }
      ]).exec();
      
      reviewCountsMap = reviewCounts.reduce((map, item) => {
        map[item._id.toString()] = item.count;
        return map;
      }, {});
    } catch (error) {
      this.logger.error(`Failed to fetch bulk review counts: ${error.message}`);
    }

    const updatedBooks = books.map((book) => {
      const issuedCount = availabilityMap[book._id.toString()] || 0;
      return {
        ...book,
        available: (book.quantity || 0) - issuedCount,
        totalReviews: reviewCountsMap[book._id.toString()] || 0,
        rating: Number((book.rating || 0).toFixed(1)),
      };
    });

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
    const currentBook = await this.bookModel.findById(id).exec();
    if (!currentBook) {
      throw new NotFoundException('Book not found');
    }

    // Validate Storage Capacity if rack, shelf, or quantity changes
    if (updateBookDto.rackNumber || updateBookDto.shelfNumber || updateBookDto.quantity !== undefined) {
      const targetRack = updateBookDto.rackNumber || currentBook.rackNumber;
      const targetShelf = updateBookDto.shelfNumber || currentBook.shelfNumber || 'S1';
      const targetQuantity = updateBookDto.quantity !== undefined ? updateBookDto.quantity : currentBook.quantity;
      await this.validateStorageCapacity(targetRack, targetShelf, targetQuantity, id);
    }

    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (adminId) {
      await this.logActivity(adminId, 'UPDATE', book.bookId, { title: book.title, updatedFields: Object.keys(updateBookDto) });
    }

    // Emit real-time event
    await this.redisEmitter.emit('BOOK_UPDATED', book);
    await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'update', book });

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

    // Emit real-time event
    await this.redisEmitter.emit('BOOK_DELETED', { id, bookId: book.bookId });
    await this.redisEmitter.emit('BOOKS_UPDATED', { type: 'delete', id });
  }

  async search(query: string): Promise<Book[]> {
    return this.bookModel.find({ $text: { $search: query } }).exec();
  }

  async findAllCategories(): Promise<string[]> {
    const categories = await this.bookModel.distinct('category').exec();
    return categories.sort();
  }

  async findByCategory(category: string): Promise<Book[]> {
    return this.bookModel.find({ category }).exec();
  }

  async findByRack(rackNumber: string): Promise<Book[]> {
    return this.bookModel.find({ rackNumber }).exec();
  }

  async createReview(createReviewDto: CreateBookReviewDto, token: string): Promise<BookReview> {

    const existingReview = await this.bookReviewModel.findOne({
      bookId: new Types.ObjectId(createReviewDto.bookId),
      memberId: new Types.ObjectId(createReviewDto.memberId),
    }).exec();

    if (existingReview) {
      throw new ConflictException('Review already exists for this book by this member');
    }

    let memberName = "Member";
    const memberServiceUrl = "http://library-api-gateway:3000/library/members";

    try {
      const response = await firstValueFrom( this.httpService.get(
          `${memberServiceUrl}/members/${createReviewDto.memberId}`,
          {
            headers: {
              Authorization: token,
            }
          }) );

      memberName = response.data?.data?.name || "Member";

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

  async findReviewsByUser(userId: string) {
    return this.bookReviewModel.find({ memberId: new Types.ObjectId(userId) }).populate('bookId').exec();
  }

  async checkReview(bookId: string, memberId: string) {
    const review = await this.bookReviewModel.findOne({
      bookId: new Types.ObjectId(bookId),
      memberId: new Types.ObjectId(memberId),
    });
    return { reviewed: !!review }
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

  async updateReview(reviewId: string, userId: string, updateData: any) {
    const review = await this.bookReviewModel.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.memberId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    review.rating = updateData.rating;
    review.reviewTitle = updateData.reviewTitle;
    review.review = updateData.review;

    await review.save();

    return review;
  }

  async deleteReview(reviewId: string, userId: string, role: string) {
    const review = await this.bookReviewModel.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (role !== 'admin' && role !== 'staff' && review.memberId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await this.bookReviewModel.findByIdAndDelete(reviewId);
    
    // Also update book rating or reviews count if needed later, 
    // but right now totalReviews is calculated dynamically when fetching books.
  }

  async getCollectionStats(): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [categoryStats, bookTypeStats, newArrivals, total] = await Promise.all([
      this.bookModel.aggregate([
        { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } }
      ]).exec(),
      this.bookModel.aggregate([
        { $group: { _id: { $toLower: "$bookType" }, count: { $sum: 1 } } }
      ]).exec(),
      this.bookModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }).exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    const stats = {
      newArrivals,
      bestSellers: 0,
      reference: 0,
      children: 0,
      academic: 0,
      ebooks: 0,
      total
    };

    // Check Categories
    categoryStats.forEach(cat => {
      const name = cat._id || "";
      if (name.includes("reference")) stats.reference += cat.count;
      if (name.includes("children") || name.includes("kid")) stats.children += cat.count;
      if (name.includes("academic") || name.includes("education")) stats.academic += cat.count;
      if (name.includes("e-book") || name.includes("ebook") || name.includes("digital")) stats.ebooks += cat.count;
    });

    // Check BookTypes (Specific for Reference and E-Books)
    bookTypeStats.forEach(bt => {
      const name = bt._id || "";
      if (name.includes("reference")) stats.reference += bt.count;
      if (name.includes("e-book") || name.includes("ebook") || name.includes("digital")) stats.ebooks += bt.count;
    });

    // Handle potential double counting if both category and bookType have "reference"
    // For now, it will sum them up, but usually they are distinct. 
    // To be safer, we could do a single query for reference:
    stats.reference = await this.bookModel.countDocuments({
      $or: [
        { category: { $regex: /reference/i } },
        { bookType: { $regex: /reference/i } }
      ]
    }).exec();

    // Best Sellers based on rating >= 4
    stats.bestSellers = await this.bookModel.countDocuments({ rating: { $gte: 4 } }).exec() || Math.floor(total * 0.1);

    return stats;
  }

  async getTopReviews(): Promise<any[]> {
    return this.bookReviewModel.aggregate([
      {
        $match: {
          status: 'Published',
          rating: { $gte: 3 }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $unwind: {
          path: '$book',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          memberName: 1,
          rating: 1,
          reviewTitle: 1,
          review: 1,
          reviewDate: 1,
          bookTitle: '$book.title',
          bookImage: '$book.images'
        }
      },
      { $sort: { reviewDate: -1 } },
      { $limit: 10 }
    ]).exec();
  }
}
