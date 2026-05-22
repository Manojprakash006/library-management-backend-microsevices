import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IssueBook, IssueBookDocument, IssueStatus, IssueType, BookCondition } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';
import { DamageReportsService } from '../../damage-reports/service/damage-reports.service';
import { DamageReportReason } from '../../damage-reports/entities/book-damage-report.entity';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(
    @InjectModel(IssueBook.name) private issueBookModel: Model<IssueBookDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
    private readonly damageReportsService: DamageReportsService,
  ) { }

  private calculateOverdue(issue: any, overdueFinePerDay: number = 10): any {
    const today = new Date();
    const updatedIssue = { ...issue };

    // If already returned, don't recalculate but infer breakdown for old records
    if (issue.status === IssueStatus.RETURNED) {
      if (updatedIssue.fine > 0 && !updatedIssue.overdueFine && !updatedIssue.conditionFine) {
        if (updatedIssue.condition && updatedIssue.condition !== BookCondition.GOOD) {
          updatedIssue.conditionFine = updatedIssue.fine;
          updatedIssue.overdueFine = 0;
        } else {
          updatedIssue.overdueFine = updatedIssue.fine;
          updatedIssue.conditionFine = 0;
        }
      }
      return updatedIssue;
    }

    if (
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
        updatedIssue.overdueFine = overdueDays * (issue.finePerDay || overdueFinePerDay);
        updatedIssue.fine = updatedIssue.overdueFine + (issue.conditionFine || 0);
      } else {
        updatedIssue.daysOverdue = 0;
        updatedIssue.overdueFine = 0;
        updatedIssue.fine = issue.conditionFine || 0;
      }
    } else {
      updatedIssue.daysOverdue = 0;
      updatedIssue.overdueFine = 0;
      updatedIssue.conditionFine = updatedIssue.conditionFine || 0;
      updatedIssue.fine = updatedIssue.conditionFine;
    }

    return updatedIssue;
  }

  private async getLibraryConfig(authHeader?: string): Promise<any> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      const response = await firstValueFrom(
        this.httpService.get(`${booksServiceUrl}/config`,
          {
            headers:authHeader? {Authorization: authHeader} : {},
          },
        )
      );
      return response.data?.data || {};
    } catch (error) {
      this.logger.error(`Failed to fetch library config: ${error.message}`);
      return {};
    }
  }

  private async calculateOverdueDynamic(issue: any): Promise<any> {
    const config = await this.getLibraryConfig();
    const overdueFinePerDay = config.overdueFinePerDay || 10;
    
    const today = new Date();
    const updatedIssue = { ...issue };

    if (issue.status === IssueStatus.RETURNED) {
      return updatedIssue;
    }

    if (issue.issueType === IssueType.TAKING_HOME && issue.dueDate) {
      const dueDateEnd = new Date(issue.dueDate);
      dueDateEnd.setHours(23, 59, 59, 999);

      if (dueDateEnd < today) {
        const overdueDays = Math.ceil((today.getTime() - dueDateEnd.getTime()) / (1000 * 60 * 60 * 24));
        updatedIssue.status = IssueStatus.OVERDUE;
        updatedIssue.daysOverdue = overdueDays;
        updatedIssue.overdueFine = overdueDays * overdueFinePerDay;
        updatedIssue.fine = updatedIssue.overdueFine + (issue.conditionFine || 0);
      } else {
        updatedIssue.daysOverdue = 0;
        updatedIssue.overdueFine = 0;
        updatedIssue.fine = issue.conditionFine || 0;
      }
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
            const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
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

        // AUTO-LOST LOGIC: If overdue for more than 30 days, mark as Lost
        if (updatedIssue.daysOverdue >= 30) {
          this.logger.log(`Auto-marking issue ${issue._id} as LOST due to 30+ days overdue.`);
          try {
            await this.returnBook(
              issue._id.toString(), 
              'SYSTEM', 
              undefined, 
              BookCondition.LOST, 
              'Automatically marked as lost after 30 days of overdue.'
            );
          } catch (autoLostError) {
            this.logger.error(`Failed to auto-mark issue ${issue._id} as lost: ${autoLostError.message}`);
          }
        }
      }
    }
  }

  private async logActivity(adminId: string, action: string, entityId: string, details: any) {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';

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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';

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
      const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-members-service:3012';
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
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
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
      copyNumber: createIssueDto.copyNumber,
      memberId: memberObjectId,
      issueType: createIssueDto.issueType,
      numberOfDays,
      issueDate: startDate,
      dueDate,
      status: IssueStatus.ACTIVE,
    });

    const savedIssue = await issuedBook.save();

    try {

      const requestsServiceUrl =
        process.env.REQUESTS_SERVICE_URL ||
        'http://library-requests-service:3014';

      await firstValueFrom(
        this.httpService.put(
          `${requestsServiceUrl}/requests/link-issue`,
          {
            memberId: createIssueDto.memberId,
            bookId: createIssueDto.bookId,
            issueId: savedIssue.issueId,
          }
        )
      );

      this.logger.log(
        `Linked request with issueId ${savedIssue.issueId}`
      );

    } catch (error) {
      console.log('ERROR while trying Request service to save ISSUE ID :', error);
      this.logger.error(
        `Failed to link issueId to request: ${error.message}`
      );
    }

    // Re-use already fetched bookData instead of re-fetching
    const currentIssuesCountAfterThis = await this.getBookIssueCount(createIssueDto.bookId);
    let newBookStatus = 'available';
    if (currentIssuesCountAfterThis >= (bookData.quantity || 1)) {
      newBookStatus = 'issued';
    }

    // Parallel execution of critical updates
    await Promise.all([
      this.updateCopyStatus(createIssueDto.copyNumber, 'issued'),
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
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
    }
  }

  private async updateBookConditionQuantity(bookId: string, condition: string, change: number): Promise<void> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookId}/condition-quantity`, { condition, change })
      );
    } catch (error) {
      this.logger.error(`Failed to update book condition quantity: ${error.message}`);
    }
  }

  private async updateCopyStatus(copyNumber: string, status: string, condition?: string): Promise<void> {
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/copies/${copyNumber}/status`, { status, condition })
      );
    } catch (error) {
      this.logger.error(`Failed to update copy status: ${error.message}`);
    }
  }

  private async updateBorrowingHistory(
    memberId: string,
    issueId: string,
    returnedAt: Date,
    fine: number
  ): Promise<void> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
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
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      await firstValueFrom(
        this.httpService.patch(`${booksServiceUrl}/books/${bookObjectId}/status`, { status })
      );
    } catch (error) {
      this.logger.error(`Failed to update book status: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ data: IssueBook[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    this.logger.log(`findAll: status=${status}, page=${page}, limit=${limit}`);

    const filter: any = {};
    if (status) {
      const s = status.trim().toLowerCase();
      if (s === 'returned') {
        filter.status = IssueStatus.RETURNED;
        filter.condition = { $nin: [BookCondition.DAMAGED, BookCondition.LOST] };
      } else if (s === 'active') {
        filter.status = { $ne: IssueStatus.RETURNED };
      } else if (s === 'overdue') {
        filter.status = IssueStatus.OVERDUE;
      } else if (s === 'damaged') {
        filter.status = IssueStatus.RETURNED;
        filter.condition = BookCondition.DAMAGED;
      } else if (s === 'lost') {
        filter.status = IssueStatus.RETURNED;
        filter.condition = BookCondition.LOST;
      } else {
        // Direct status match if none of the above
        filter.status = status;
      }
    }

    this.logger.log(`findAll filter: ${JSON.stringify(filter)}`);

    const [issuedBooks, total] = await Promise.all([
      this.issueBookModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.issueBookModel.countDocuments(filter).exec(),
    ]);

    const config = await this.getLibraryConfig();
    const overdueFinePerDay = config.overdueFinePerDay || 10;
    const today = new Date();

    const data = await Promise.all(issuedBooks.map(async (issue) => {
      const updatedIssue = this.calculateOverdue(issue.toObject(), overdueFinePerDay);
      
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
          const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library--service:3001';
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
    const issuedBook = await this.issueBookModel.findOne({ issueId: id}).exec();
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
        const bookServiceURL = process.env.BOOKS_SERVICE_URL || "http://library-books-service:3001";


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

      return { ...updatedIssue, book, reviewed: reviewed, copyNumber: issue.copyNumber };
    })
    );

    return enriched;
  }

  async findActiveByMember(memberId: string): Promise<any[]> {

    const issues = await this.issueBookModel.find({
      memberId: new Types.ObjectId(memberId),
      status: { $ne: IssueStatus.RETURNED },
    }).sort({ createdAt: -1 }).lean();

    const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';

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

  async returnBook(id: string, adminId?: string, authHeader?: string, condition: BookCondition = BookCondition.GOOD, remarks?: string): Promise<IssueBook> {
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
    issuedBook.condition = condition;
    issuedBook.remarks = remarks;

    // Fetch book data for price and title
    const bookId = issuedBook.bookId.toString();
    let bookData: any = null;
    try {
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://library-books-service:3001';
      const bookResponse = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${bookId}`));
      bookData = bookResponse.data?.data;
    } catch (e) {
      this.logger.error(`Failed to fetch book data: ${e.message}`);
    }

    // Fetch library config for fine rates
    const config = await this.getLibraryConfig(authHeader);
    const overdueFinePerDay = config.overdueFinePerDay || 10;
    const damagedFinePercent = (config.damagedFinePercent || 50) / 100;
    const lostFinePercent = (config.lostFinePercent || 100) / 100;

    // Calculate overdue fine only for Taking Home books that have due date
    let overdueFine = 0;
    if (issuedBook.issueType === IssueType.TAKING_HOME && issuedBook.dueDate) {
      const dueDateEnd = new Date(issuedBook.dueDate);
      dueDateEnd.setHours(23, 59, 59, 999);

      if (returnDate > dueDateEnd) {
        const overdueDays = Math.ceil((returnDate.getTime() - dueDateEnd.getTime()) / (1000 * 60 * 60 * 24));
        issuedBook.daysOverdue = overdueDays;
        overdueFine = overdueDays * overdueFinePerDay;
      }
    }

    let extraFine = 0;
    let extraReason = '';

    // Handle Damaged or Lost conditions
    if (condition !== BookCondition.GOOD) {
      const bookPrice = bookData?.price || 0;
      
      if (condition === BookCondition.LOST) {
        extraFine = Math.ceil(bookPrice * lostFinePercent);
        extraReason = 'Book Lost';
      } else if (condition === BookCondition.DAMAGED) {
        extraFine = Math.ceil(bookPrice * damagedFinePercent);
        extraReason = 'Book Damaged';
      }

      // Create Damage/Loss Report
      try {
        await this.damageReportsService.create({
          reportId: `REP${Date.now()}`,
          issueId: issuedBook._id.toString(),
          bookId: bookId,
          memberId: issuedBook.memberId.toString(),
          reason: condition === BookCondition.LOST ? DamageReportReason.LOST : DamageReportReason.DAMAGED,
          bookAmount: bookPrice,
          fineAmount: extraFine,
          totalAmount: extraFine
        });
      } catch (error) {
        this.logger.error(`Failed to create damage report: ${error.message}`);
      }
    }

    issuedBook.overdueFine = overdueFine;
    issuedBook.conditionFine = extraFine;
    issuedBook.fine = overdueFine + extraFine;
    const totalFine = issuedBook.fine;

    this.logger.log(`Saving return: overdueFine=${issuedBook.overdueFine}, conditionFine=${issuedBook.conditionFine}, fine=${issuedBook.fine}`);

    if (totalFine > 0) {
      // Create a Fine in Payments Service
      try {
        const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005';
        await firstValueFrom(this.httpService.post(`${paymentsServiceUrl}/fines/create`, {
          memberId: issuedBook.memberId.toString(),
          issueId: issuedBook._id.toString(),
          bookId: issuedBook.bookId.toString(),
          amount: totalFine,
          reason: `${overdueFine > 0 ? `Overdue by ${issuedBook.daysOverdue} days. ` : ''}${extraReason ? extraReason : ''}`.trim()
        }, {
          headers: authHeader ? { Authorization: authHeader } : {}
        }));
        this.logger.log(`Created fine of ₹${totalFine} for member ${issuedBook.memberId}`);
      } catch (error) {
        this.logger.error(`Failed to create fine in Payment Service: ${error.message}`);
      }
    }

    const savedIssue = await issuedBook.save();

    try {

      const requestsServiceUrl =
        process.env.REQUESTS_SERVICE_URL || 'http://library-requests-service:3014';

      await firstValueFrom(
        this.httpService.put(
          `${requestsServiceUrl}/requests/${issuedBook.issueId}/mark-returned`,
          {},
          {
            headers: authHeader
              ? { Authorization: authHeader }
              : {},
          },
        ),
      );
      this.logger.log(
        `Updated request status to RETURNED for issueId ${issuedBook.issueId}`
      );

    } catch (error) {

      console.log('REQUEST UPDATE ERROR while RETURN BOOk :', error);
      this.logger.error(
        `Failed to update request status: ${error.message}`
      );
    }

    // Prepare updates
    const updates: Promise<any>[] = [
      this.updateBorrowingHistory(
        issuedBook.memberId.toString(),
        issuedBook._id.toString(),
        returnDate,
        totalFine
      )
    ];

    if (condition !== BookCondition.GOOD) {
      // For Damaged or Lost, we update the specific quantities
      updates.push(this.updateBookConditionQuantity(bookId, condition, 1));
      
      // We don't force 'available' status for Lost books here, 
      // let the BooksService handle the status based on remaining quantity.
      if (condition === BookCondition.DAMAGED) {
        updates.push(this.updateBookStatus(bookId, 'available'));
        updates.push(this.updateCopyStatus(issuedBook.copyNumber, 'available', 'Damaged'));
      } else {
        // For Lost, we mark copy as lost
        updates.push(this.updateCopyStatus(issuedBook.copyNumber, 'lost', 'Lost'));
      }
    } else {
      // Normal return
      updates.push(this.updateBookStatus(bookId, 'available'));
      updates.push(this.updateCopyStatus(issuedBook.copyNumber, 'available', 'Good'));
    }

    await Promise.all(updates);

    // Fire and forget non-critical operations (don't await)
    if (adminId) {
      this.logActivity(adminId, 'RETURN_BOOK', savedIssue._id.toString(), {
        bookId: issuedBook.bookId,
        memberId: issuedBook.memberId,
        bookTitle: bookData?.title || 'Book',
        memberName: 'Member',
        condition,
        remarks
      });
    }

    const isReadingInside = issuedBook.issueType === 'Reading Inside Library';
    const actionText = isReadingInside ? 'finished reading' : 'successfully returned';
    const titleText = isReadingInside ? 'Reading Session Completed' : 'Book Returned Successfully';

    this.sendNotification(
      issuedBook.memberId.toString(),
      'BOOK_RETURNED',
      titleText,
      `Thank you! You have ${actionText} "${bookData?.title || 'Book'}" (Book ID: ${bookId}) on ${returnDate.toLocaleDateString()}.${totalFine > 0 ? ` A fine of ₹${totalFine} was calculated.` : ''}`
    );

    this.recordReturnVisit(
      issuedBook.memberId.toString(),
      issuedBook.bookId.toString()
    );

    // Emit unified real-time event
    await this.redisEmitter.emit('ISSUES_UPDATED', { 
      type: 'return', 
      issue: savedIssue,
      bookTitle: bookData?.title || 'Book'
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

  async renewBook(issueId: string, renewDays?: number) {

    const issue = await this.issueBookModel.findOne({issueId: issueId});
    
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    if (issue.status === 'Returned') {
      throw new BadRequestException('Cannot renew a returned book');
    }

    const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 
          'http://library-members-service:3012';

    const memberResponse: any = await firstValueFrom(
      this.httpService.get( `${membersServiceUrl}/members/${issue.memberId}/rewards` )
    );

    const extraRenewals = memberResponse.data?.data?.extraRenewals || 0;

    const maxRenewals = 1 + extraRenewals;

    if (issue.renewCount >= maxRenewals) {

      throw new BadRequestException(
        `Renewal limit reached (Max ${maxRenewals} times)`
      );

    }
    
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const due = new Date(issue.dueDate);
    const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    if (dueOnly < todayOnly) {
      throw new BadRequestException('Cannot renew overdue book. Please clear fine.');
    }
    
    const finalRenewDays = renewDays ?? 7;
    
    const newDueDate = new Date(issue.dueDate);
    newDueDate.setDate(newDueDate.getDate() + finalRenewDays);

    issue.dueDate = newDueDate;
    issue.numberOfDays = finalRenewDays;
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
  async getBulkMemberStats(memberIds: string[]): Promise<Record<string, any>> {
    const objectIds = memberIds.map(id => new Types.ObjectId(id));
    
    // Find all issues for these members
    const allIssues = await this.issueBookModel.find({
      memberId: { $in: objectIds }
    }).lean().exec();

    const stats: Record<string, any> = {};
    
    memberIds.forEach(id => {
      const memberIssues = allIssues.filter(i => i.memberId.toString() === id);
      const activeIssues = memberIssues.filter(i => i.status === IssueStatus.ACTIVE || i.status === IssueStatus.OVERDUE);
      
      stats[id] = {
        currentlyBorrowed: activeIssues.length,
        totalHistory: memberIssues.length,
        activeBookIds: activeIssues.map(i => i.bookId),
        booklistBorrowed: activeIssues.map(i => {
          const dueDate = i.dueDate ? new Date(i.dueDate).toLocaleDateString() : 'N/A';
          return `${i.bookId} - ${i.issueType} - ${i.status} - Due: ${dueDate}`;
        })
      };
    });

    return stats;
  }

  async getBulkBookCounts(bookIds: string[]): Promise<Record<string, number>> {
    const objectIds = bookIds
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id));

    const results = await this.issueBookModel.aggregate([
      {
        $match: {
          bookId: { $in: objectIds },
          status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] }
        }
      },
      {
        $group: {
          _id: '$bookId',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts: Record<string, number> = {};
    results.forEach(res => {
      counts[res._id.toString()] = res.count;
    });

    return counts;
  }
}
