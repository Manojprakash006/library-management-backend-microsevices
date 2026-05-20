import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MemberProgressService {
  private readonly logger = new Logger(MemberProgressService.name);

  constructor(
    private readonly httpService: HttpService,
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

  async getReadingActivity(memberId: string) {

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

        const monthIndex = date.getMonth();

        monthlyData[monthIndex].books += 1;

      });

      return {
        success: true,
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
}