import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MemberDashboardService } from '../../member-dashboard/service/member-dashboard.service';

@Injectable()
export class MemberProgressService {
  private readonly logger = new Logger(MemberProgressService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly memberDashboardService: MemberDashboardService,
  ) {}

  async getSummary(memberId: string, authHeader?: string) {
    try {
      const issuesService =
        process.env.ISSUES_SERVICE_URL ||
        'http://library-issues-service:3013';

      const paymentsService =
        process.env.PAYMENTS_SERVICE_URL ||
        'http://library-payments-service:3005';

      const issuedResponse = await firstValueFrom(
        this.httpService.get(
          `${issuesService}/issues/member/${memberId}`,
          {
            headers: authHeader
              ? { Authorization: authHeader }
              : {},
          },
        ),
      );

      const issues = issuedResponse.data.data || [];

      const issuedBooks = issues.length;

      const returnedBooks = issues.filter(
        (item: any) => item.status === 'Returned',
      ).length;

      const overdueBooks = issues.filter(
        (item: any) =>
          item.status !== 'Returned' &&
          item.daysOverdue > 0,
      ).length;

      const lostDamagedBooks = issues.filter(
        (item: any) =>
          item.condition === 'Lost' ||
          item.condition === 'Damaged',
      ).length;

      const renewedBooks = issues.filter(
        (item: any) => item.renewCount > 0,
      ).length;

      let totalFinePaid = 0;

      try {
        const fineResponse = await firstValueFrom(
          this.httpService.get(
            `${paymentsService}/fines/member/${memberId}`,
            {
              headers: authHeader
                ? { Authorization: authHeader }
                : {},
            },
          ),
        );

        const fines = fineResponse.data.data || [];

        totalFinePaid = fines
          .filter((fine: any) => fine.status === 'PAID')
          .reduce(
            (sum: number, fine: any) =>
              sum + (fine.amount || 0),
            0,
          );
      } catch (error) {
        this.logger.error(
          `Failed to fetch fine data: ${error.message}`,
        );
      }

      return {
        booksIssued: issuedBooks,
        booksReturned: returnedBooks,
        renewedBooks,
        overdueBooks,
        finePaid: totalFinePaid,
        lostOrDamaged: lostDamagedBooks,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get member progress summary: ${error.message}`,
      );

      throw error;
    }
  }

  async getDamageHistory(memberId: string) {

    try {
      const issuesServiceUrl =
        process.env.ISSUES_SERVICE_URL ||
        'http://library-issues-service:3004';

      const response = await firstValueFrom(
        this.httpService.get(
          `${issuesServiceUrl}/issues/member/${memberId}`
        )
      );

      const issues = response.data?.data || [];

      const filtered = issues.filter(
        (item: any) =>
          item.condition === 'Damaged' ||
          item.condition === 'Lost'
      );

      const formatted = filtered.map((item: any) => ({
        id: item._id,
        bookTitle: item.book?.title || 'Unknown Book',
        condition: item.condition,
        fine: item.conditionFine || item.fine || 0,
        date: item.returnDate,
        remarks: item.remarks || '-',
      }));

      return {
        success: true,
        count: formatted.length,
        data: formatted,
      };

    } catch (error) {

      this.logger.error(
        `Failed to fetch damage history: ${error.message}`
      );

      throw new InternalServerErrorException(
        'Failed to fetch damage history'
      );
    }
  }

  async getReadingActivity(memberId: string, year?: number) {

    // const currentYear = new Date().getFullYear();
    const selectedYear = year || new Date().getFullYear();

    try {
      const issuesService =
        process.env.ISSUES_SERVICE_URL ||
        'http://library-issues-service:3013';

      const response = await firstValueFrom(
        this.httpService.get(
          `${issuesService}/issues/member/${memberId}`
        )
      );

      const issues = response.data?.data || [];

      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const monthlyData = months.map((month) => ({
        month,
        books: 0,
      }));

      issues.forEach((issue: any) => {

        const date = new Date(issue.issueDate);

        const issueYear = date.getFullYear();

        if (issueYear === selectedYear) {

          const monthIndex = date.getMonth();

          monthlyData[monthIndex].books += 1;
        }

      });

      return {
        success: true,
        year: selectedYear,
        data: monthlyData,
      };

    } catch (error) {

      this.logger.error(
        `Failed to fetch reading activity: ${error.message}`
      );

      throw new InternalServerErrorException(
        'Failed to fetch reading activity'
      );
    }
  }

  async getFinePaymentActivity(memberId: string, year?: number, authHeader?: string) {

    const selectedYear = year || new Date().getFullYear();

    try {

      const paymentsService =
        process.env.PAYMENTS_SERVICE_URL ||
        'http://library-payments-service:3015';

      const response = await firstValueFrom(
        this.httpService.get(
          `${paymentsService}/fines/member/${memberId}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
      );

      const fines = response.data?.data || [];

      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const monthlyData = months.map((month) => ({
        month,
        amount: 0,
      }));

      fines.forEach((fine: any) => {

        const date = new Date(fine.paidAt || fine.createdAt);

        const fineYear = date.getFullYear();

        if (fineYear === selectedYear) {

          const monthIndex = date.getMonth();

          monthlyData[monthIndex].amount += fine.amount || 0;
        }
      });

      return {
        success: true,
        year: selectedYear,
        data: monthlyData,
      };

    } catch (error) {

      this.logger.error(
        `Failed to fetch fine payment activity: ${error.message}`
      );

      throw new InternalServerErrorException(
        'Failed to fetch fine payment activity'
      );
    }
  }

  async getOverdueBooks(memberId: string) {
    try {
      const overdueBooks =
        await this.memberDashboardService.getOverdueBooks(memberId);

      return { success: true, data: overdueBooks };

    } catch (error) { this.logger.error( `Failed to fetch overdue books: ${error.message}` );

      throw new InternalServerErrorException(
        'Failed to fetch overdue books'
      );
    }
  }

  async getAchievements( memberId: string, authHeader: string ) {
    try {

      const issuesServiceUrl =
        process.env.ISSUES_SERVICE_URL ||
        'http://library-api-gateway:3000/library/issues';

      const response = await firstValueFrom(

        this.httpService.get(
          `${issuesServiceUrl}/issues/member/${memberId}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )

      );

      const issues = response.data?.data || [];
      const today = new Date();

      const returnedBooks = issues.filter(
        (issue: any) =>
          issue.status === "Returned"
      ).length;

      const activityDates = new Set<string>();

      issues.forEach((issue: any) => {

        if (issue.issueDate) {
          activityDates.add(
            new Date(issue.issueDate)
              .toISOString()
              .split("T")[0]
          );
        }

        if (issue.returnDate) {
          activityDates.add(
            new Date(issue.returnDate)
              .toISOString()
              .split("T")[0]
          );
        }
      });

      const sortedDates = Array.from(activityDates)
        .sort(
          (a: any, b: any) =>
            new Date(b).getTime() -
            new Date(a).getTime()
        );

      let streak = 0;

      let currentDate = new Date();

      for (const date of sortedDates) {

        const currentStr =
          currentDate
            .toISOString()
            .split("T")[0];

        if (date === currentStr) {

          streak++;

          currentDate.setDate(
            currentDate.getDate() - 1
          );

        } else {
          break;
        }
      }

      const overdueBooks = issues.filter(
        (issue: any) => {

          if (
            issue.issueType !== "Taking Home" ||
            !issue.dueDate
          ) {
            return false;
          }

          const dueDate = new Date(issue.dueDate);

          return (
            issue.status !== "Returned" &&
            dueDate < today
          );
        }
      );

      const responsibleMember =
        overdueBooks.length === 0;

      const completedThisMonth = issues.filter(
        (issue: any) => {

          if (
            issue.status !== "Returned" ||
            !issue.returnDate
          ) {
            return false;
          }

          const returnDate =
            new Date(issue.returnDate);

          return (
            returnDate.getMonth() === today.getMonth() &&

            returnDate.getFullYear() === today.getFullYear()
          );
        }
      );

      const monthlyGoal = 5;

      const monthlyGoalCompleted =
        completedThisMonth.length >= monthlyGoal;

      const eliteReader =
        returnedBooks >= 10;

      return {

        success: true,

        data: {
          returnedBooks,
          readingStreak: streak,
          responsibleMember,
          monthlyGoal,
          monthlyCompleted: completedThisMonth.length,
          monthlyGoalCompleted,
          eliteReader,
          overdueBooksCount: overdueBooks.length,
        },
      };

    } catch (error) {

      this.logger.error(
        `Failed to fetch achievements: ${error.message}`
      );

      throw new InternalServerErrorException(
        'Failed to fetch achievements'
      );
    }
  }
}