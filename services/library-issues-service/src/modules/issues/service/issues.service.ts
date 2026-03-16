import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IssueBook, IssueBookDocument, IssueStatus, IssueType } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(
    @InjectModel(IssueBook.name) private issueBookModel: Model<IssueBookDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<IssueBook> {
    const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();
    
    let dueDate = null;
    let numberOfDays = null;
    
    // Only set due date and number of days for Taking Home
    if (createIssueDto.issueType === IssueType.TAKING_HOME) {
      numberOfDays = createIssueDto.numberOfDays || 7; // Default 7 days if not provided
      dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + numberOfDays);
    }

    const issuedBook = new this.issueBookModel({
      bookId: new Types.ObjectId(createIssueDto.bookId),
      memberId: new Types.ObjectId(createIssueDto.memberId),
      issueType: createIssueDto.issueType,
      numberOfDays,
      issueDate: startDate,
      dueDate,
      status: IssueStatus.ACTIVE,
    });

    const savedIssue = await issuedBook.save();

    // Update book status to issued
    await this.updateBookStatus(createIssueDto.bookId, 'issued');
    
    // Add to member's borrowing history
    await this.addToBorrowingHistory(
      createIssueDto.memberId,
      createIssueDto.bookId,
      savedIssue._id.toString(),
      startDate,
      dueDate
    );

    return savedIssue;
  }

  private async addToBorrowingHistory(
    memberId: string,
    bookId: string,
    issueId: string,
    borrowedAt: Date,
    dueDate: Date
  ): Promise<void> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/members/${memberId}/borrowing-history`, {
          bookId,
          issueId,
          borrowedAt,
          dueDate,
          status: 'borrowed'
        })
      );
      this.logger.log(`Added borrowing history for member ${memberId}`);
    } catch (error) {
      this.logger.error(`Failed to add borrowing history: ${error.message}`);
    }
  }

  private async updateBookStatus(bookId: string, status: string): Promise<void> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3000';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/library/books/${bookId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
    }
  }

  private async updateBorrowingHistory(
    memberId: string,
    issueId: string,
    returnedAt: Date,
    fine: number
  ): Promise<void> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3003';
      await firstValueFrom(
        this.httpService.put(`${membersServiceUrl}/members/${memberId}/borrowing-history/${issueId}`, {
          returnedAt,
          fine,
          status: 'returned'
        })
      );
      this.logger.log(`Updated borrowing history for member ${memberId}`);
    } catch (error) {
      this.logger.error(`Failed to update borrowing history: ${error.message}`);
    }
  }

  private async updateBookStatusByObjectId(bookObjectId: string, status: string): Promise<void> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3000';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/library/books/${bookObjectId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
    }
  }

  async findAll(): Promise<IssueBook[]> {
    const issuedBooks = await this.issueBookModel.find().exec();
    const today = new Date();

    return issuedBooks.map((issue) => {
      const issueObj = issue.toObject();
      if (issueObj.status !== IssueStatus.RETURNED && new Date(issueObj.dueDate) < today) {
        const overdueDays = Math.ceil((today.getTime() - new Date(issueObj.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        issueObj.status = IssueStatus.OVERDUE;
        issueObj.daysOverdue = overdueDays;
        issueObj.fine = overdueDays * (issueObj.finePerDay || 10);
      }
      return issueObj as IssueBook;
    });
  }

  async findOne(id: string): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }
    return issuedBook;
  }

  async findByMember(memberId: string): Promise<IssueBook[]> {
    return this.issueBookModel.find({ memberId: new Types.ObjectId(memberId) }).exec();
  }

  async findActiveByMember(memberId: string): Promise<IssueBook[]> {
    return this.issueBookModel.find({
      memberId: new Types.ObjectId(memberId),
      status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] },
    }).exec();
  }

  async returnBook(id: string): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }

    if (issuedBook.status === IssueStatus.RETURNED) {
      throw new BadRequestException('Book already returned');
    }

    const returnDate = new Date();
    issuedBook.returnDate = returnDate;
    issuedBook.status = IssueStatus.RETURNED;

    // Calculate fine only for Taking Home books that have due date
    if (issuedBook.issueType === IssueType.TAKING_HOME && issuedBook.dueDate && returnDate > issuedBook.dueDate) {
      const overdueDays = Math.ceil((returnDate.getTime() - issuedBook.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      issuedBook.daysOverdue = overdueDays;
      issuedBook.fine = overdueDays * issuedBook.finePerDay;
    }

    const savedIssue = await issuedBook.save();

    // Update book status back to available
    const bookId = issuedBook.bookId.toString();
    await this.updateBookStatus(bookId, 'available');
    
    // Update member's borrowing history
    await this.updateBorrowingHistory(
      issuedBook.memberId.toString(),
      issuedBook._id.toString(),
      returnDate,
      issuedBook.fine || 0
    );

    return savedIssue;
  }

  async update(id: string, updateIssueDto: any): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }

    if (updateIssueDto.numberOfDays && updateIssueDto.issueDate) {
      const startDate = new Date(updateIssueDto.issueDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + updateIssueDto.numberOfDays);
      updateIssueDto.dueDate = dueDate;
    }

    Object.assign(issuedBook, updateIssueDto);
    return issuedBook.save();
  }

  async findRecent(limit: number = 5): Promise<IssueBook[]> {
    return this.issueBookModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getOverdueCount(): Promise<number> {
    const today = new Date();
    const issues = await this.issueBookModel.find({
      status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] },
      dueDate: { $lt: today },
    }).exec();
    return issues.length;
  }

  async getIssuesCount(date?: string): Promise<number> {
    if (!date) {
      return this.issueBookModel.countDocuments();
    }
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    return this.issueBookModel.countDocuments({
      issueDate: { $gte: startOfDay, $lt: endOfDay },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.issueBookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Issued book record not found');
    }
  }
}
