import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MemberDashboardService } from '../../member-dashboard/service/member-dashboard.service';
import { ContactService } from '../../contact/service/contact.service';

@Injectable()
export class MemberProgressService {
  private readonly logger = new Logger(MemberProgressService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly memberDashboardService: MemberDashboardService,
    private readonly contactService: ContactService
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

        this.httpService.get( `${issuesServiceUrl}/issues/member/${memberId}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )

      );

      const issues = response.data?.data || [];
      const today = new Date();

      const returnedBooks = issues.filter( (issue: any) => issue.status === "Returned" ).length;
      const config = await this.contactService.getLibraryConfig();

      const allowedGapDays = 5;

      const isHoliday = (date: Date) => {

        if (date.getDay() === 0) {
          return true;
        }

        if (
          config?.isHolidayActive &&
          config?.holidayFromDate &&
          config?.holidayToDate
        ) {

          const from = new Date(config.holidayFromDate);
          const to = new Date(config.holidayToDate);

          const current = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );

          return current >= from && current <= to;
        }

        return false;
      };

      const takingHomeIssues = issues
        .filter(
          (issue: any) =>
            issue.issueType === "Taking Home"
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.issueDate).getTime() -
            new Date(b.issueDate).getTime()
        );

      let streak = 0;

      let longestStreak = 0;

      let currentRunningStreak = 0;

      let previousEndDate: Date | null = null;

      for (const issue of takingHomeIssues) {

        const startDate = new Date(issue.issueDate);

        const endDate = issue.returnDate
          ? new Date(issue.returnDate)
          : today;

        const normalizedStart = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );

        const normalizedEnd = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        if (previousEndDate) {

          const gapTime =
            normalizedStart.getTime() -
            previousEndDate.getTime();

          const gapDays = Math.floor(
            gapTime / (1000 * 60 * 60 * 24)
          ) - 1;

          if (gapDays > allowedGapDays) {
            longestStreak = Math.max(
              longestStreak, currentRunningStreak
            );
            currentRunningStreak = 0;
          }
        }

        let current = new Date(normalizedStart);

        while (current <= normalizedEnd) {

          if (!isHoliday(current)) {
            streak++;
            currentRunningStreak++;
          }

          current.setDate(current.getDate() + 1);
        }

        previousEndDate = normalizedEnd;

        longestStreak = Math.max(
          longestStreak, currentRunningStreak
        );
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

          return ( issue.status !== "Returned" && dueDate < today );
        }
      );

      const responsibleMember = overdueBooks.length === 0;

      const completedThisMonth = issues.filter( (issue: any) => {

          if (
            issue.status !== "Returned" || !issue.returnDate
          ) {
            return false;
          }

          const returnDate = new Date(issue.returnDate);

          return (
            returnDate.getMonth() === today.getMonth() &&

            returnDate.getFullYear() === today.getFullYear()
          );
        }
      );

      const monthlyGoal = 5;

      const monthlyGoalCompleted = completedThisMonth.length >= monthlyGoal;
      const eliteReader = returnedBooks >= 10;

      const membersServiceUrl =
        process.env.MEMBERS_SERVICE_URL ||
        'http://library-api-gateway:3000/library/members';

      const memberResponse: any = await firstValueFrom(
        this.httpService.get(
          `${membersServiceUrl}/members/${memberId}/rewards`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
      );

      const extraRenewals =
        memberResponse.data?.data?.extraRenewals || 0;

      return {

        success: true,

        data: {
          returnedBooks,
          readingStreak: streak,
          longestStreak,
          responsibleMember,
          monthlyGoal,
          monthlyCompleted: completedThisMonth.length,
          monthlyGoalCompleted,
          eliteReader,
          overdueBooksCount: overdueBooks.length,
          extraRenewals,
          nextRewardTarget: 60,
          rewardUnlocked: extraRenewals > 0,
        },
      };

    } catch (error) {

      this.logger.error( `Failed to fetch achievements: ${error.message}` );

      throw new InternalServerErrorException( 'Failed to fetch achievements');
    }
  }
}