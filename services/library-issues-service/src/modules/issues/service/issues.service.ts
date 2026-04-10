import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException, Inject } from '@nestjs/common';
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
  ) { }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      // const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      const membersServiceUrl = 'http://library-api-gateway:3000/library/members';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/activities/logs`, {
          adminId,
          action,
          entityType: 'ISSUE',
          entityId,
          details
        })
      );
    } catch (error) {
      this.logger.error(`Failed to log activity to member service: ${error.message}`);
    }
  }

  private async sendNotification(memberId: string, type: string, title: string, message: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications`, {
          memberId,
          type,
          title,
          message
        })
      );
    } catch (error) {
      this.logger.error(`Failed to send notification to member service: ${error.message}`);
    }
  }

  private async autoRecordLibraryVisit(memberId: string, bookId: string, issueType: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';

      // Map issueType to purpose
      // "Taking Home" -> "issue" (immediate in/out)
      // "Reading Inside Library" -> "reading" (only timeIn, staying in library)
      const purpose = issueType === 'Taking Home' ? 'issue' : 'reading';

      // For issue (Taking Home), timeIn=timeOut (immediate exit)
      // For reading (Reading Inside), only timeIn (staying in library)
      const isImmediate = purpose === 'issue';
      const now = new Date().toISOString();

      const payload = {
        memberId,
        bookId,
        purpose,
        timeIn: now,
        timeOut: isImmediate ? now : null,
        isAutoRecorded: true
      };

      this.logger.log(`Calling auto-record API: ${membersServiceUrl}/library-visits/auto-record with payload: ${JSON.stringify(payload)}`);

      const response = await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/library-visits/auto-record`, payload)
      );

      this.logger.log(`Auto-recorded library visit success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.logger.error(`Failed to auto-record library visit: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  private async recordReturnVisit(memberId: string, bookId: string) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';

      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/library-visits/record-return`, {
          memberId,
          bookId
        })
      );
      this.logger.log(`Recorded return visit for member ${memberId}, book ${bookId}`);
    } catch (error) {
      this.logger.error(`Failed to record return visit: ${error.message}`);
    }
  }

  private calculateOverdue(issue: any) {
    const today = new Date();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (
      issue.status !== IssueStatus.RETURNED &&
      issue.issueType === IssueType.TAKING_HOME &&
      issue.dueDate
    ) {
      const due = new Date(issue.dueDate);
      const dueOnly = new Date(
        due.getFullYear(),
        due.getMonth(),
        due.getDate()
      );

      if (dueOnly < todayOnly) {
        const overdueDays = Math.ceil(
          (todayOnly.getTime() - dueOnly.getTime()) /
          (1000 * 60 * 60 * 24)
        );

        return {
          ...issue,
          status: IssueStatus.OVERDUE,
          daysOverdue: overdueDays,
          fine: overdueDays * (issue.finePerDay || 10),
        };
      }
    }

    return {
      ...issue,
      daysOverdue: 0,
      fine: 0,
    };
  }

  async create(createIssueDto: CreateIssueDto, adminId?: string, authHeader?: string): Promise<IssueBook> {
    const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();

    let dueDate = null;
    let numberOfDays = null;

    // Only set due date and number of days for Taking Home
    if (createIssueDto.issueType === IssueType.TAKING_HOME) {
      numberOfDays = createIssueDto.numberOfDays || 7; // Default 7 days if not provided
      dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + numberOfDays);
    }

    // STRICT FINE CHECK: Only check with Payments Service (Single Source of Truth)
    try {
      const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-api-gateway:3000/library/payments';
      const checkResponse = await firstValueFrom(
        this.httpService.get<{ data: { hasPendingFines: boolean; totalPendingAmount: number } }>(
          `${paymentsServiceUrl}/fines/member/${createIssueDto.memberId}/pending-check`,
          {
            headers: authHeader ? { Authorization: authHeader } : {}
          }
        )
      );

      const pendingData = checkResponse.data?.data;
      if (pendingData?.hasPendingFines || (pendingData?.totalPendingAmount || 0) > 0) {
        throw new BadRequestException(`Please clear your unpaid fine of ₹${pendingData.totalPendingAmount} before borrowing a new book`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Failed to verify pending fines: ${error.message}`);
      // If payment service is down, we might want to block as a safety measure
      // throw new BadRequestException('Fine verification failed. Please try again later.');
    }

    // Check total active issues limit for "Taking Home" only (Max 5 books per member)
    if (createIssueDto.issueType === IssueType.TAKING_HOME) {
      const activeTakingHomeCount = await this.issueBookModel.countDocuments({
        memberId: new Types.ObjectId(createIssueDto.memberId),
        issueType: IssueType.TAKING_HOME,
        status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] }
      });

      if (activeTakingHomeCount >= 5) {
        throw new BadRequestException('Borrowing limit reached: Members can only take a maximum of 5 books home at a time.');
      }
    }

    // Check book availability first before issuing
    try {
      const booksServiceUrl = 'http://library-api-gateway:3000/library/books';
      const bookResponse = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books/${createIssueDto.bookId}`)
      );
      const bookData = bookResponse.data?.data;
      if (!bookData) {
        throw new BadRequestException('Book not found');
      }

      if (bookData.bookType === 'Reference Book' && createIssueDto.issueType === IssueType.TAKING_HOME) {
        throw new BadRequestException('Reference books can only be read inside the library and cannot be taken home.');
      }

      const currentIssuesCount = await this.getBookIssueCount(createIssueDto.bookId);
      const maxQuantity = bookData.quantity || 1;

      if (currentIssuesCount >= maxQuantity) {
        throw new BadRequestException('Book is out of stock and cannot be issued (all copies are currently issued)');
      }

      // Check if this specific member already has this exact book actively issued
      const existingIssue = await this.issueBookModel.findOne({
        bookId: new Types.ObjectId(createIssueDto.bookId),
        memberId: new Types.ObjectId(createIssueDto.memberId),
        status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] }
      }).exec();

      if (existingIssue) {
        throw new ConflictException('This member already has an active issue for this book.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to verify book availability. Book may not exist.');
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

    // Update book status: if all copies are issued, mark as 'issued' (out of stock), else keep it 'available'
    let newBookStatus = 'available';
    try {
      const booksServiceUrl = 'http://library-api-gateway:3000/library/books';
      const bookResponse = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books/${createIssueDto.bookId}`)
      );
      const bookData = bookResponse.data?.data;
      const maxQuantity = bookData?.quantity || 1;
      const currentIssuesCountAfterThis = await this.getBookIssueCount(createIssueDto.bookId);
      if (currentIssuesCountAfterThis >= maxQuantity) {
        newBookStatus = 'issued';
      }
    } catch (e) {
      newBookStatus = 'issued'; // fallback
    }
    await this.updateBookStatus(createIssueDto.bookId, newBookStatus);

    // Add to member's borrowing history
    await this.addToBorrowingHistory(
      createIssueDto.memberId,
      createIssueDto.bookId,
      savedIssue._id.toString(),
      startDate,
      dueDate
    );

    if (adminId) {
      await this.logActivity(adminId, 'ISSUE_BOOK', savedIssue._id.toString(), {
        bookId: createIssueDto.bookId,
        memberId: createIssueDto.memberId
      });
    }

    // Send generic notification to the member about their new book
    await this.sendNotification(
      createIssueDto.memberId,
      'BOOK_ISSUED',
      'Book Issued Successfully',
      `You have successfully borrowed the book (ID: ${createIssueDto.bookId}). ${dueDate ? `Please make sure to return it by ${dueDate.toLocaleDateString()} to avoid any fines.` : 'Enjoy reading inside the library!'}`
    );

    // Auto-record library visit for tracking
    await this.autoRecordLibraryVisit(
      createIssueDto.memberId,
      createIssueDto.bookId,
      createIssueDto.issueType
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
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
      const booksServiceUrl = 'http://library-api-gateway:3000/library/books';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
      // Rollback might be needed here in a strict system, but let's log for now.
    }
  }

  private async updateBorrowingHistory(
    memberId: string,
    issueId: string,
    returnedAt: Date,
    fine: number
  ): Promise<void> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/members/${memberId}/borrow`, {
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
      const booksServiceUrl = 'http://library-api-gateway:3000/library/books';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookObjectId}/status`, { status })
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
      // Skip overdue check for Reading Inside Library (no due date) or returned books
      if (issueObj.status !== IssueStatus.RETURNED &&
        issueObj.issueType === IssueType.TAKING_HOME &&
        issueObj.dueDate &&
        new Date(issueObj.dueDate) < today) {
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

  async findByMember(memberId: string): Promise<any[]> {
    const issuedBooks = await this.issueBookModel
      .find({ memberId: new Types.ObjectId(memberId) })
      .lean();

    const enriched = await Promise.all(
      issuedBooks.map(async (issue) => {
        let updatedIssue = this.calculateOverdue(issue);

        let book = null;

        try {
          const bookServiceURL = "http://library-api-gateway:3000/library/books";

          const response = await firstValueFrom(
            this.httpService.get(`${bookServiceURL}/books/${issue.bookId}`)
          );

          book = response.data?.data;
        } catch (error) {
          console.log("BOOK FETCH FAILED:", error.message);
        }

        return { ...updatedIssue, book };
      })
    );

    return enriched;
  }

  async findActiveByMember(memberId: string): Promise<any[]> {

    const issues = await this.issueBookModel.find({
      memberId: new Types.ObjectId(memberId),
      status: { $in: ["Active"] },
    }).lean();

    const booksServiceUrl = 'http://library-api-gateway:3000/library/books';

    const enrichedIssues = await Promise.all(
      issues.map(async (issue) => {
        try {
          const bookResponse = await firstValueFrom(
            this.httpService.get(`${booksServiceUrl}/books/${issue.bookId}`)
          );

          return { ...issue, bookId: bookResponse.data?.data || null };
        } catch (error) {
          return { ...issue, bookId: null };
        }
      })
    );

    return enrichedIssues;
  }

  async returnBook(id: string, adminId?: string, authHeader?: string): Promise<IssueBook> {
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
      issuedBook.fine = overdueDays * (issuedBook.finePerDay || 10);

      // Create a Fine in Payments Service
      try {
        const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-api-gateway:3000/library/payments';
        await firstValueFrom(this.httpService.post(`${paymentsServiceUrl}/fines/create`, {
          memberId: issuedBook.memberId.toString(),
          issueId: issuedBook._id.toString(),
          bookId: issuedBook.bookId.toString(),
          amount: issuedBook.fine,
          reason: `Overdue by ${overdueDays} days`
        }, {
          headers: authHeader ? { Authorization: authHeader } : {}
        }));
        this.logger.log(`Created fine of ₹${issuedBook.fine} for member ${issuedBook.memberId}`);
      } catch (error) {
        this.logger.error(`Failed to create fine in Payment Service: ${error.message}`);
      }
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

    if (adminId) {
      await this.logActivity(adminId, 'RETURN_BOOK', savedIssue._id.toString(), {
        bookId: issuedBook.bookId,
        memberId: issuedBook.memberId
      });
    }

    // Send generic notification to the member about their book return
    await this.sendNotification(
      issuedBook.memberId.toString(),
      'BOOK_RETURNED',
      'Book Returned Successfully',
      `Thank you! You have successfully returned the book (ID: ${issuedBook.bookId}) on ${returnDate.toLocaleDateString()}.${issuedBook.fine > 0 ? ` Note: A fine of rs ${issuedBook.fine} was calculated for late return.` : ''}`
    );

    // Auto-record library visit for return (member came to return book)
    await this.autoRecordLibraryVisit(
      issuedBook.memberId.toString(),
      issuedBook.bookId.toString(),
      'return'
    );

    // Record return visit (update timeOut for reading visits)
    await this.recordReturnVisit(
      issuedBook.memberId.toString(),
      issuedBook.bookId.toString()
    );

    return savedIssue;
  }

  async getCompletedCount(memberId: string): Promise<number> {
    return this.issueBookModel.countDocuments({
      memberId: new Types.ObjectId(memberId),
      status: IssueStatus.RETURNED,
    });
  }

  async update(id: string, updateIssueDto: any, adminId?: string): Promise<IssueBook> {
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
    const savedIssue = await issuedBook.save();

    if (adminId) {
      await this.logActivity(adminId, 'UPDATE', savedIssue._id.toString(), { updatedFields: Object.keys(updateIssueDto) });
    }

    return savedIssue;
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
      issueType: IssueType.TAKING_HOME,
      dueDate: { $lt: today },
    }).exec();
    return issues.length;
  }

  async getIssuesCount(date?: string): Promise<number> {
    if (!date) {
      return this.issueBookModel.countDocuments({
        status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] }
      });
    }
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    return this.issueBookModel.countDocuments({
      issueDate: { $gte: startOfDay, $lt: endOfDay },
    });
  }

  async getReturnsCount(date?: string): Promise<number> {
    if (!date) {
      return this.issueBookModel.countDocuments({ status: IssueStatus.RETURNED });
    }
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    return this.issueBookModel.countDocuments({
      status: IssueStatus.RETURNED,
      returnDate: { $gte: startOfDay, $lt: endOfDay },
    });
  }

  async getBookIssueCount(bookId: string): Promise<number> {
    return this.issueBookModel.countDocuments({
      bookId: new Types.ObjectId(bookId),
      status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] },
    });
  }

  async renewBook(issueId: string) {
    const issue = await this.issueBookModel.findById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    if (issue.status === 'Returned') {
      throw new BadRequestException('Cannot renew a returned book');
    }

    if (issue.renewCount >= 2) {
      throw new BadRequestException('Renewal limit reached (Max 2 times)');
    }

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const due = new Date(issue.dueDate);
    const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    if (dueOnly < todayOnly) {
      throw new BadRequestException('Cannot renew overdue book. Please clear fine.');
    }

    const newDueDate = new Date(issue.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    issue.dueDate = newDueDate;
    issue.renewCount = (issue.renewCount || 0) + 1;

    await issue.save();

    return {
      message: 'Book renewed successfully',
      newDueDate,
      renewCount: issue.renewCount,
    };
  }

  async remove(id: string, adminId?: string): Promise<void> {
    const result = await this.issueBookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Issued book record not found');
    }

    if (adminId) {
      await this.logActivity(adminId, 'DELETE', id, { bookId: result.bookId });
    }
  }
}
