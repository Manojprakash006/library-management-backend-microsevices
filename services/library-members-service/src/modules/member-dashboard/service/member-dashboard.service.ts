import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  private async getMemberStatsFromIssues(memberId: string): Promise<{
      booksHeld: number;
      booksAtHome: number;
      readingInsideLibrary: number;
      totalFines: number
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

        const totalFines = allIssues.reduce((sum: number, issue: any) => {
          if (issue.dueDate && new Date(issue.dueDate) < today) {
            const dueDate = new Date(issue.dueDate);

            if (dueDate < today) {
              const daysOverdue = Math.max(1, Math.floor(
                (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
              ));

              return sum + daysOverdue * 10;
            }
          }
          return sum;
        }, 0);

        return {
          booksHeld: stats.totalActive,
          booksAtHome: stats.booksAtHome,
          readingInsideLibrary: stats.readingInsideLibrary,
          totalFines
        };
      } catch (error) {
        this.logger.error(`Failed to fetch member stats from issues service: ${error.message}`);
        return { booksHeld: 0, booksAtHome: 0, readingInsideLibrary: 0, totalFines: 0 };
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
  
      try {
        const stats = await this.getMemberStatsFromIssues(userId);
        booksHeld = stats.booksHeld;
        readingInsideLibrary = stats.readingInsideLibrary;
        totalFines = stats.totalFines;
      } catch (e) {
        console.log("ISSUE SERVICE FAILED :", e);
    }
  
      let pendingRequests = 0;
  
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
        const overdue = await this.getOverdueBooks(userId);
        overdueBooks = overdue.length;
      } catch (error) {
        console.log("OverDue fetch Failed :", error.message);
      }
  
    return {
      issuedBooks: booksHeld,
      pendingRequests,
      activeReservations: readingInsideLibrary,
      overdueBooks,
      totalFines,
    };
  }

  async getOverdueBooks(userId: string) {

    const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

    const response = await firstValueFrom(
      this.httpService.get(`${issuesServiceUrl}/issues/member/${userId}`) );

    const allIssues = response.data?.data || [];

    const today = new Date();

    const overDueBooks = allIssues.filter((issue: any) => {
      return (
        issue.issueType === "Taking Home" &&
        issue.dueDate &&
        new Date(issue.dueDate) < today
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
    return this.issueModel
      .find({ memberId: new Types.ObjectId(userId) })
      .populate('bookId')
      .sort({ createdAt: -1 })
      .lean();
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

  async renewBook(renewDto: RenewBookDto) {
    console.log("Received ID:", renewDto.issueId);
    const issue = await this.issueModel.findById(new mongoose.Types.ObjectId(renewDto.issueId));
    console.log("Found Isuues :", issue);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const newDueDate = new Date(issue.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    issue.dueDate = newDueDate;
    await issue.save();

    return {
      message: 'Book renewed successfully',
      newDueDate,
    };
  }

  async submitReview(userId: string, reviewDto: SubmitReviewDto) {
    return {
      message: 'Review submitted',
      userId,
      ...reviewDto,
    };
  }
}