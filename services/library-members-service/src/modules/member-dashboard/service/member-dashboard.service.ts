import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { ReportDamageDto } from '../dto/report-damage.dto';
import { RenewBookDto } from '../dto/renew-book.dto';
import { SubmitReviewDto } from '../dto/submit-review.dto';
import { BookRequest } from '../shared/book-request.entity';
import { IssueBook } from '../shared/issue-book.entity';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { status } from '@grpc/grpc-js';

@Injectable()
export class MemberDashboardService {
  logger: any;
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>, private readonly httpService: HttpService,
    @InjectModel(IssueBook.name) private issueModel: Model<IssueBook>,
    @InjectModel(BookRequest.name) private requestModel: Model<BookRequest>,
  ) { }

  private async getMemberStatsFromIssues(memberId: string): Promise<{
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number;
    overdueCount: number;
    takingHome: number;
    inLibrary: number;
  }> {
    try {
      const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

      const statsResponse = await firstValueFrom(
        this.httpService.get<{ data: { booksAtHome: number; readingInsideLibrary: number; totalActive: number } }>(
          `${issuesServiceUrl}/issues/member/${memberId}/stats`
        )
      );

      const stats = statsResponse.data?.data || { booksAtHome: 0, readingInsideLibrary: 0, totalActive: 0 };

      const allIssuesResponse = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}`)
      );

      const allIssues = allIssuesResponse.data?.data || [];

      const today = new Date();

      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const overDueBooks = allIssues.filter((issue: any) => {
        return issue.status === "Overdue";
      });

      const totalFines = overDueBooks.reduce((sum: number, issue: any) => {
        const due = new Date(issue.dueDate);
        const today = new Date();

        const days = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)) || 0;

        return sum + (days > 0 ? days * 10 : 0);
      }, 0);

      const takingHome = allIssues.filter((issue: any) => 
        issue.issueType === "Taking Home" && issue.status !== "Returned").length;

      const inLibrary = allIssues.filter((issue: any) => 
      issue.issueType === "Reading Inside Library" && issue.status !== "Returned").length;

      return {
        booksHeld: stats.totalActive,
        booksAtHome: stats.booksAtHome,
        readingInsideLibrary: stats.readingInsideLibrary,
        totalFines,
        overdueCount: overDueBooks.length,
        takingHome,
        inLibrary,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch member stats from issues service: ${error.message}`);
      return {
        booksHeld: 0,
        booksAtHome: 0,
        readingInsideLibrary: 0,
        totalFines: 0,
        overdueCount: 0,
        takingHome: 0,
        inLibrary: 0,
      };
    }
  }

  async getDashboardStats(userId: string) {
    const member = await this.memberModel.findById(userId).exec();

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    let booksHeld = 0;
    let readingInsideLibrary = 0;
    let totalFines = 0;
    let pendingRequests = 0;
    let takingHome = 0;
    let inLibrary = 0;

    try {
      const requestServiceUrl = "http://library-api-gateway:3000/library/requests";

      const url = `${requestServiceUrl}/requests/member/${userId}`;

      const response = await firstValueFrom(
        this.httpService.get(url)
      );

      const requests = response.data?.data || [];

      pendingRequests = requests.filter(
        (req: any) => req.status === "Pending").length;

    } catch (e) {
      console.log("REQUEST SERVICE FAILED :", e.message);
    }

    let overdueBooks = 0;

    try {
      const stats = await this.getMemberStatsFromIssues(userId);
      booksHeld = stats.booksHeld;
      readingInsideLibrary = stats.readingInsideLibrary;
      totalFines = stats.totalFines;
      overdueBooks = stats.overdueCount;
      takingHome = stats.takingHome;
      inLibrary = stats.inLibrary;
    } catch (e) {
      console.log("ISSUE SERVICE FAILED :", e);
    }

    try {
      const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-api-gateway:3000/library/payments';
      const response = await firstValueFrom(
        this.httpService.get(`${paymentsServiceUrl}/fines/member/${userId}/pending-check`)
      );
      totalFines += response.data?.data?.totalPendingAmount || 0;
    } catch (e) {
      console.log("PAYMENTS SERVICE FAILED :", e.message);
    }

    return {
      issuedBooks: booksHeld,
      pendingRequests,
      activeReservations: readingInsideLibrary,
      overdueBooks,
      totalFines,
      takingHome,
      inLibrary,
    };
  }

  async getOverdueBooks(userId: string) {

    const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

    const response = await firstValueFrom(
      this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}`));

    const allIssues = response.data?.data || [];

    const today = new Date();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const overDueBooks = allIssues.filter((issue: any) => {
      if (issue.issueType !== "Taking Home" || !issue.dueDate) return false;

      const today = new Date();
      const due = new Date(issue.dueDate);

      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

      return (
        issue.status !== "Returned" &&
        dueOnly < todayOnly
      );
    });

    return overDueBooks.map((issue: any) => {
      return {
        _id: issue._id,
        bookId: issue.book,
        bookRequestId: issue._id,
        dueDate: issue.dueDate,
        overDue: issue.daysOverdue || 0,
        status: issue.status,
        issueType: issue.issueType,
        issueDate: issue.issueDate,
        issueId: issue.issueId,
      };
    });
  }

  async getRecentRequests(userId: string) {
    try {
      const requestServiceUrl = "http://library-api-gateway:3000/library/requests";

      const response = await firstValueFrom(
        this.httpService.get(`${requestServiceUrl}/requests/member/${userId}`));

      const requests = response.data?.data || [];

      return requests?.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    } catch (error) {
      console.log("FAILED TO FETCH RECENT REQUESTS:", error.message);
      return [];
    }
  }

  async getCurrentlyBorrowedBooks(userId: string) {
    try {
      const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}/active`)
      );

      return response.data?.data || [];

    } catch (error) {
      console.log('FAILED TO FETCH BORROWED BOOKS:', error.message);
      return [];
    }
  }

  async getBookDetails(issueId: string) {
    const issue = await this.issueModel
      .findById(issueId)
      .populate('bookId')
      .lean();

    if (!issue) {
      throw new Error('Issue not found');
    }

    return issue;
  }

  async getMyBooks(userId: string) {
    try {
      const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}`)
      );

      const issues = response.data?.data || [];

      issues.sort( (a: any, b: any) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

      return issues.map((issue: any) => {
        const today = new Date();

        const daysOverdue = issue.dueDate ? Math.max(0, Math.ceil(
          (today.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

        return {
          _id: issue._id,
          bookId: issue.book,
          dueDate: issue.dueDate,
          issueDate: issue.issueDate,
          status: issue.status,
          issueType: issue.issueType,
          damageReported: issue.damageReported,
          damageNote: issue.damageNote,
          daysOverdue,
          renewCount: issue.renewCount || 0,
          issueId: issue.issueId,
          returnDate: issue.returnDate,
          reviewed: issue.reviewed,
        };
      });

    } catch (error) {
      console.log("FAILED TO FETCH MY BOOKS:", error.message);
      return [];
    }
  }

  async reportBookDamage(damageDto: ReportDamageDto) {
    await this.issueModel.findByIdAndUpdate(damageDto.bookId, {
      damageReported: true,
      damageNote: damageDto.description,
    });

    return {
      message: 'Damage reported successfully',
      issueId: damageDto.bookId,
    };
  }

  // async renewBook(renewDto: RenewBookDto) {
  //   const issueServiceURL = "http://library-api-gateway:3000/library/issues";

  //   try {
  //     const response = await firstValueFrom(this.httpService.put(
  //       `${issueServiceURL}/issues/renew/${renewDto.issueId}`
  //     ));
  //     return response.data;
  //   } catch (error: any) {

  //     throw new BadRequestException(error.response?.data?.message || "Renew failed");
  //   }
  // }

  async renewBook(renewDto: RenewBookDto, authHeader: string) {

    const requestServiceURL =
      process.env.REQUEST_SERVICE_URL ||
      'http://library-requests-service:3014';

    try {

      const issueServiceURL =
        process.env.ISSUE_SERVICE_URL ||
        'http://library-issues-service:3013';

      const issueResponse = await firstValueFrom(
        this.httpService.get(
          `${issueServiceURL}/issues/${renewDto.issueId}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
      );

      const issue = issueResponse.data?.data;

      const requestPayload: any = {
        memberId: issue.memberId,
        bookId: issue.bookId,
        issueId: renewDto.issueId,
        requestType: 'RENEW',
        reason: renewDto.reason,
      };

      if (renewDto.renewDays) {
        requestPayload.renewDays = renewDto.renewDays;
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${requestServiceURL}/requests`,
          requestPayload,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
      );

      return response.data;

    } catch (error: any) {
      console.log('RENEW ERROR :', error.response?.data);
      throw new BadRequestException(
        error.response?.data?.message || 'Renew request failed'
      );
    }
  }

  async submitReview(userId: string, reviewDto: SubmitReviewDto) {
    return {
      message: 'Review submitted',
      userId,
      ...reviewDto,
    };
  }

  async  getMyReviews(userId: string, token: string) {
    try {
      const bookServiceUrl = 'http://library-api-gateway:3000/library/books';

      const response = await firstValueFrom(
        this.httpService.get(`${bookServiceUrl}/books/my-reviews/${userId}`, {
          headers: {
            Authorization: token,
          },
        })
      );
      return response.data?.data || [];
    } catch (error) {
      console.log("FAILED TO FETCH MY REVIEWS:", error.message);
      throw error;
    }
  }

  async getBookReviews(bookId: string, userId: string) {
    try {
      const bookServiceUrl = 'http://library-api-gateway:3000/library/books';

      const response = await firstValueFrom(
        this.httpService.get(`${bookServiceUrl}/books/${bookId}/reviews`)
      );

      const reviews = response.data?.data || [];

      return reviews.map((review: any) => ({
        ...review, isCurrentUser: review.memberId === userId,
      }))
    } catch (error) {
      console.log("FAILED TO FETCH REVIEWS:", error.message);
      return [];
    }
  }

  async updateReview(reviewId: string, userId: string, data: any, token: string) {
    try {
      const bookServiceUrl = 'http://library-api-gateway:3000/library/books';

      const response = await firstValueFrom(
        this.httpService.put(
          `${bookServiceUrl}/books/reviews/${reviewId}`,
          data,
          {
            headers: {
              Authorization: token,
            },
          }
        )
      );

      return response.data?.data;
    } catch (error) {
      console.log("FAILED TO UPDATE REVIEW:", error.message);
      throw error;
    }
  }
}