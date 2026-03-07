import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { BookRequest, BookRequestDocument } from '../../book-requests/entities/book-request.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>,
  ) {}

  async getDashboardStats() {
    const totalBooks = await this.bookModel.countDocuments();
    const availableBooks = await this.bookModel.countDocuments({ status: 'available' });
    const issuedBooks = await this.bookModel.countDocuments({ status: 'issued' });
    const pendingRequests = await this.bookRequestModel.countDocuments({ status: 'Pending' });
    
    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      totalMembers: 0,
      activeIssues: issuedBooks,
      overdueBooks: 0,
      pendingRequests,
    };
  }

  async getInventorySummary() {
    const booksByCategory = await this.bookModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    
    return {
      totalBooks: await this.bookModel.countDocuments(),
      booksByCategory,
    };
  }

  async getPopularBooks() {
    return this.bookModel.find().sort({ borrowCount: -1 }).limit(10).select('-__v');
  }

  async getStatCards() {
    const totalBooks = await this.bookModel.countDocuments();
    const availableBooks = await this.bookModel.countDocuments({ status: 'available' });
    const issuedBooks = await this.bookModel.countDocuments({ status: 'issued' });
    const pendingRequests = await this.bookRequestModel.countDocuments({ status: 'Pending' });

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      pendingRequests,
    };
  }

  async getRecentBooks() {
    return this.bookModel.find().sort({ createdAt: -1 }).limit(5).select('-__v');
  }

  async getOverdueBooks() {
    return this.bookModel.find({ status: 'overdue' }).select('-__v');
  }

  async getPendingRequests() {
    return this.bookRequestModel.find({ status: 'Pending' })
      .populate('bookId', 'title author')
      .populate('memberId', 'name email')
      .sort({ requestDate: -1 })
      .select('-__v');
  }
}
