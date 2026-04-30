import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IssueBook, IssueBookDocument, IssueStatus, IssueType } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(
    @InjectModel(IssueBook.name) private issueBookModel: Model<IssueBookDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
  ) { }

  private calculateOverdue(issue: any): any {
    const today = new Date();
    const updatedIssue = { ...issue };

    if (
      issue.status !== IssueStatus.RETURNED &&
      issue.issueType === IssueType.TAKING_HOME &&
      issue.dueDate
    ) {
      const dueDateEnd = new Date(issue.dueDate);
      dueDateEnd.setHours(23, 59, 59, 999);

      if (dueDateEnd < today) {
        const overdueDays = Math.ceil(
          (today.getTime() - dueDateEnd.getTime()) / (1000 * 60 * 60 * 24),
        );
        updatedIssue.status = IssueStatus.OVERDUE;
        updatedIssue.daysOverdue = overdueDays;
        updatedIssue.fine = overdueDays * (issue.finePerDay || 10);
      } else {
        updatedIssue.daysOverdue = 0;
        updatedIssue.fine = 0;
      }
    } else {
      updatedIssue.daysOverdue = 0;
      updatedIssue.fine = 0;
    }

    return updatedIssue;
  }

  onModuleInit() {
    // Start automatic background checker for overdue books
    // Run every 1 hour (3600000 ms)
    setInterval(() => {
      this.checkAllOverdueBooks().catch(err => 
        this.logger.error('Automatic overdue check failed', err)
      );
    }, 3600000);
    
    this.logger.log('Automatic Overdue Checker started (Every 1 hour)');
  }

  async checkAllOverdueBooks() {
    const today = new Date();
    // Find all active/overdue books that are past their due date
    const issues = await this.issueBookModel.find({
      status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] },
      issueType: IssueType.TAKING_HOME,
      dueDate: { $lt: today }
    }).exec();

    if (issues.length === 0) return;

    this.logger.log(`Found ${issues.length} potential overdue issues. Updating...`);

    for (const issue of issues) {
      const updatedIssue = this.calculateOverdue(issue.toObject());
      
      // If status changed to Overdue or if we just want to refresh the stats
      if (updatedIssue.status === IssueStatus.OVERDUE) {
        const wasAlreadyOverdue = issue.status === IssueStatus.OVERDUE;
        
        await this.issueBookModel.findByIdAndUpdate(issue._id, { 
          status: IssueStatus.OVERDUE,
          daysOverdue: updatedIssue.daysOverdue,
          fine: updatedIssue.fine
        });
        
        // Only notify if it's a NEW overdue or if we want periodic reminders
        if (!wasAlreadyOverdue) {
          let bookTitle = 'A book';
          try {
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
            const bookRes = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${issue.bookId}`));
            bookTitle = bookRes.data?.data?.title || 'A book';
          } catch (e) {}

          await this.redisEmitter.emit('ISSUES_UPDATED', { 
            type: 'status_change', 
            status: IssueStatus.OVERDUE,
            bookTitle: bookTitle,
            issue: { ...updatedIssue, _id: issue._id } 
          });
        }
      }
    }
  }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
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



  async create(createIssueDto: CreateIssueDto, adminId?: string, authHeader?: string): Promise<IssueBook> {
    const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();

    let dueDate = null;
    let numberOfDays = null;

    // Only set due date and number of days for Taking Home
    if (createIssueDto.issueType === IssueType.TAKING_HOME) {
      numberOfDays = createIssueDto.numberOfDays || 7; // Default 7 days if not provided
      dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + numberOfDays);
      dueDate.setHours(23, 59, 59, 999);
      dueDate.setMinutes(dueDate.getMinutes() - 330);
    }

    // STRICT FINE CHECK: Only check with Payments Service (Single Source of Truth)
    try {
      const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005';
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

    // Strict ID validation to prevent 500 errors
    let memberObjectId: Types.ObjectId;
    let bookObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(createIssueDto.memberId);
      bookObjectId = new Types.ObjectId(createIssueDto.bookId);
    } catch (e) {
      throw new BadRequestException('Invalid Member ID or Book ID format');
    }

    // Check book availability first before issuing
    let bookData: any;
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      const bookResponse = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/books/${createIssueDto.bookId}`)
      );
      bookData = bookResponse.data?.data;
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
        bookId: bookObjectId,
        memberId: memberObjectId,
        status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] }
      }).exec();

      if (existingIssue) {
        throw new ConflictException('This member already has an active issue for this book.');
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) throw error;
      this.logger.error(`Book verification failed: ${error.message}`);
      throw new BadRequestException('Failed to verify book availability. Service might be down.');
    }

    const issuedBook = new this.issueBookModel({
      bookId: bookObjectId,
      memberId: memberObjectId,
      issueType: createIssueDto.issueType,
      numberOfDays,
      issueDate: startDate,
      dueDate,
      status: IssueStatus.ACTIVE,
    });

    const savedIssue = await issuedBook.save();

    // Re-use already fetched bookData instead of re-fetching
    const currentIssuesCountAfterThis = await this.getBookIssueCount(createIssueDto.bookId);
    let newBookStatus = 'available';
    if (currentIssuesCountAfterThis >= (bookData.quantity || 1)) {
      newBookStatus = 'issued';
    }

    // Parallel execution of critical updates
    await Promise.all([
      this.updateBookStatus(createIssueDto.bookId, newBookStatus),
      this.addToBorrowingHistory(
        createIssueDto.memberId,
        createIssueDto.bookId,
        savedIssue._id.toString(),
        startDate,
        dueDate,
        bookData?.title // Pass book title
      )
    ]);

    // Fire and forget non-critical operations (don't await)
    if (adminId) {
      this.logActivity(adminId, 'ISSUE_BOOK', savedIssue._id.toString(), {
        bookId: createIssueDto.bookId,
        memberId: createIssueDto.memberId,
        bookTitle: bookData?.title,
        memberName: createIssueDto.memberName || 'Member'
      });
    }


    const isReadingInside = createIssueDto.issueType === 'Reading Inside Library';
    const actionTextCreate = isReadingInside ? 'started reading' : 'borrowed';
    const titleTextCreate = isReadingInside ? 'Reading Session Started' : 'Book Borrowed Successfully';

    this.sendNotification(
      createIssueDto.memberId,
      'BOOK_ISSUED',
      titleTextCreate,
      `Dear member, you have ${actionTextCreate} "${bookData.title}" (Book ID: ${bookData.bookId || createIssueDto.bookId}). ${dueDate ? `Please make sure to return it by ${dueDate.toLocaleDateString()} to avoid any fines.` : 'Enjoy your reading session inside the library!'}`
    );

    this.autoRecordLibraryVisit(
      createIssueDto.memberId,
      createIssueDto.bookId,
      createIssueDto.issueType
    );

    // Emit real-time event
    await this.redisEmitter.emit('ISSUE_CREATED', savedIssue);
    await this.redisEmitter.emit('ISSUES_UPDATED', { type: 'create', issue: savedIssue });

    return savedIssue;
  }

  private async addToBorrowingHistory(
    memberId: string,
    bookId: string,
    issueId: string,
    borrowedAt: Date,
    dueDate: Date,
    bookTitle?: string
  ): Promise<void> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/members/${memberId}/borrowing-history`, {
          bookId,
          issueId,
          bookTitle,
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
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
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
          issueId, // Critical: Missing in original code
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
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookObjectId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ data: IssueBook[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === 'returned') {
        filter.status = IssueStatus.RETURNED;
      } else if (normalizedStatus === 'active') {
        filter.status = { $ne: IssueStatus.RETURNED };
      }
    }

    const [issuedBooks, total] = await Promise.all([
      this.issueBookModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.issueBookModel.countDocuments(filter).exec(),
    ]);

    const today = new Date();

    const data = await Promise.all(issuedBooks.map(async (issue) => {
      const updatedIssue = this.calculateOverdue(issue.toObject());
      
      // If status changed to Overdue, save it to DB and emit event
      if (updatedIssue.status === IssueStatus.OVERDUE && issue.status !== IssueStatus.OVERDUE) {
        await this.issueBookModel.findByIdAndUpdate(issue._id, { 
          status: IssueStatus.OVERDUE,
          daysOverdue: updatedIssue.daysOverdue,
          fine: updatedIssue.fine
        });
        
        // Fetch basic details for the notification
        let bookTitle = 'A book';
        try {
          const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
          const bookRes = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${issue.bookId}`));
          bookTitle = bookRes.data?.data?.title || 'A book';
        } catch (e) {}

        // Emit event for real-time notification
        await this.redisEmitter.emit('ISSUES_UPDATED', { 
          type: 'status_change', 
          status: IssueStatus.OVERDUE,
          bookTitle: bookTitle,
          issue: { ...updatedIssue, _id: issue._id } 
        });
      }
      
      return updatedIssue;
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

    const enriched = await Promise.all(issuedBooks.map(async (issue) => {
      let updatedIssue = this.calculateOverdue(issue);
      let book = null;
      let reviewed = false;

      try {
        const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://localhost:3001";


        const response = await firstValueFrom(
          this.httpService.get(`${bookServiceURL}/books/${issue.bookId}`)
        );

        const reviewResponse = await firstValueFrom(
          this.httpService.get(`${bookServiceURL}/books/check`, {
            params: {
              bookId: issue.bookId,
              memberId: issue.memberId,
            },
          })
        );

        reviewed = reviewResponse.data?.reviewed || false;

        book = response.data?.data;
      } catch (error) {
        console.log("BOOK FETCH FAILED:", error.message);
      }

      return { ...updatedIssue, book, reviewed: reviewed };
    })
    );

    return enriched;
  }

  async findActiveByMember(memberId: string): Promise<any[]> {

    const issues = await this.issueBookModel.find({
      memberId: new Types.ObjectId(memberId),
      status: { $ne: IssueStatus.RETURNED },
    }).lean();

    const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

    const enrichedIssues = await Promise.all(
      issues.map(async (issue) => {
        const updatedIssue = this.calculateOverdue(issue);
        try {
          const bookResponse = await firstValueFrom(
            this.httpService.get(`${booksServiceUrl}/books/${issue.bookId}`)
          );

          return { ...updatedIssue, bookId: bookResponse.data?.data || null };
        } catch (error) {
          return { ...updatedIssue, bookId: null };
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
    if (issuedBook.issueType === IssueType.TAKING_HOME && issuedBook.dueDate) {
      const dueDateEnd = new Date(issuedBook.dueDate);
      dueDateEnd.setHours(23, 59, 59, 999);

      if (returnDate > dueDateEnd) {
        const overdueDays = Math.ceil((returnDate.getTime() - dueDateEnd.getTime()) / (1000 * 60 * 60 * 24));
        issuedBook.daysOverdue = overdueDays;
        issuedBook.fine = overdueDays * (issuedBook.finePerDay || 10);

        // Create a Fine in Payments Service
        try {
          const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005';
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
    }

    const savedIssue = await issuedBook.save();

    // Parallel execution of critical updates
    const bookId = issuedBook.bookId.toString();
    await Promise.all([
      this.updateBookStatus(bookId, 'available'),
      this.updateBorrowingHistory(
        issuedBook.memberId.toString(),
        issuedBook._id.toString(),
        returnDate,
        issuedBook.fine || 0
      )
    ]);

    // Fetch book title for notifications and logging
    let bookTitle = 'Book';
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
      const bookResponse = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${bookId}`));
      bookTitle = bookResponse.data?.data?.title || 'Book';
    } catch (e) {
      this.logger.error(`Failed to fetch book title for notification: ${e.message}`);
    }

    // Fire and forget non-critical operations (don't await)
    if (adminId) {
      this.logActivity(adminId, 'RETURN_BOOK', savedIssue._id.toString(), {
        bookId: issuedBook.bookId,
        memberId: issuedBook.memberId,
        bookTitle: bookTitle,
        memberName: 'Member'
      });
    }


    const isReadingInside = issuedBook.issueType === 'Reading Inside Library';
    const actionText = isReadingInside ? 'finished reading' : 'successfully returned';
    const titleText = isReadingInside ? 'Reading Session Completed' : 'Book Returned Successfully';

    this.sendNotification(
      issuedBook.memberId.toString(),
      'BOOK_RETURNED',
      titleText,
      `Thank you! You have ${actionText} "${bookTitle}" (Book ID: ${bookId}) on ${returnDate.toLocaleDateString()}.${issuedBook.fine > 0 ? ` A fine of ₹${issuedBook.fine} was calculated for late return.` : ''}`
    );

    this.recordReturnVisit(
      issuedBook.memberId.toString(),
      issuedBook.bookId.toString()
    );

    // Emit unified real-time event
    await this.redisEmitter.emit('ISSUES_UPDATED', { 
      type: 'return', 
      issue: savedIssue,
      bookTitle
    });

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
      dueDate.setHours(23, 59, 59, 999);
      dueDate.setMinutes(dueDate.getMinutes() - 330);
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

  async getTodaysIssuesData(): Promise<IssueBook[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.issueBookModel.find({
      issueDate: { $gte: today, $lt: tomorrow },
    }).sort({ issueDate: -1 }).exec();
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

    // Emit real-time event
    await this.redisEmitter.emit('ISSUE_RENEWED', issue);
    await this.redisEmitter.emit('ISSUES_UPDATED', { type: 'renew', issue });

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
