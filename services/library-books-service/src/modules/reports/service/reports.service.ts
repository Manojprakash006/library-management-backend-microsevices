import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../books/entities/book.entity';

interface DailyIssueReturnReport {
  date: string;
  booksIssued: number;
  booksReturned: number;
}

interface OverdueReport {
  overdueStatus: number;
  booksOverdue: number;
}

interface RackInventoryReport {
  rackNumber: string;
  location: string;
  total: number;
  available: number;
  issued: number;
  capacityPercentage: number;
}

interface MemberActivityReport {
  activeMembers: number;
  inactiveMembers: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async getDailyIssueReturnReport(): Promise<DailyIssueReturnReport> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      date: today.toISOString().split('T')[0],
      booksIssued: 0, // Simplified - would need IssueBook model
      booksReturned: 0,
    };
  }

  async getOverdueReport(): Promise<OverdueReport> {
    return {
      overdueStatus: 0,
      booksOverdue: 0,
    };
  }

  async getRackInventoryReport(): Promise<RackInventoryReport[]> {
    const books = await this.bookModel.find().exec();
    const rackMap: Record<string, RackInventoryReport> = {};

    for (const book of books) {
      const rackNumber = book.rackNumber;

      if (!rackMap[rackNumber]) {
        rackMap[rackNumber] = {
          rackNumber: rackNumber,
          location: 'Main Hall',
          total: 0,
          available: 0,
          issued: 0,
          capacityPercentage: 0,
        };
      }

      const quantity = book.quantity || 0;
      rackMap[rackNumber].total += quantity;
      rackMap[rackNumber].available += quantity; // Simplified
    }

    for (const rackNumber in rackMap) {
      const rack = rackMap[rackNumber];
      const capacity = 50;
      rack.capacityPercentage = Math.round((rack.total / capacity) * 100);
    }

    return Object.values(rackMap);
  }

  async getRackInventoryById(rackNumber: string): Promise<RackInventoryReport> {
    const books = await this.bookModel.find({ rackNumber }).exec();

    if (books.length === 0) {
      throw new NotFoundException('Rack not found or has no books');
    }

    let total = 0;
    let available = 0;

    for (const book of books) {
      const quantity = book.quantity || 0;
      total += quantity;
      available += quantity;
    }

    const capacity = 50;
    const capacityPercentage = Math.round((total / capacity) * 100);

    return {
      rackNumber: rackNumber,
      location: 'Main Hall',
      total: total,
      available: available,
      issued: 0,
      capacityPercentage: capacityPercentage,
    };
  }

  async getMemberActivityReport(): Promise<MemberActivityReport> {
    return {
      activeMembers: 0,
      inactiveMembers: 0,
    };
  }

  async getAllReports(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rackInventory = await this.getRackInventoryReport();

    return {
      dailyIssueReturn: {
        date: today.toISOString().split('T')[0],
        booksIssued: 0,
        booksReturned: 0,
      },
      overdue: {
        overdueStatus: 0,
        booksOverdue: 0,
      },
      rackInventory: rackInventory,
      memberActivity: {
        activeMembers: 0,
        inactiveMembers: 0,
      },
    };
  }
}
