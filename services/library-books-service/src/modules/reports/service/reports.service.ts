import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Book, BookDocument } from '../../books/entities/book.entity';
import { BookReview, BookReviewDocument } from '../../books/entities/book-review.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookReview.name) private bookReviewModel: Model<BookReviewDocument>,
    private readonly httpService: HttpService,
  ) {}

  // Helper: Get Authorization Header Config
  private getHeaders(authHeader?: string) {
    return authHeader ? { headers: { Authorization: authHeader } } : undefined;
  }

  private getFilterDateRange(filterType?: string, startDateStr?: string, endDateStr?: string): { start: Date; end: Date } | null {
    if (!filterType) return null;
    
    let baseDate = new Date();
    if (startDateStr) {
      baseDate = new Date(startDateStr);
    }
    
    // Construct start and end as UTC dates to prevent server timezone offsets from shifting dates
    const start = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()));
    const end = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate()));

    if (filterType === 'daily') {
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);
    } else if (filterType === 'weekly') {
      const day = start.getUTCDay();
      const diff = start.getUTCDate() - day + (day === 0 ? -6 : 1);
      start.setUTCDate(diff);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCDate(diff + 6);
      end.setUTCHours(23, 59, 59, 999);
    } else if (filterType === 'monthly') {
      start.setUTCDate(1);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCMonth(end.getUTCMonth() + 1);
      end.setUTCDate(0);
      end.setUTCHours(23, 59, 59, 999);
    } else if (filterType === 'yearly') {
      start.setUTCMonth(0, 1);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCMonth(11, 31);
      end.setUTCHours(23, 59, 59, 999);
    } else if (filterType === 'custom' && startDateStr) {
      const customStart = new Date(startDateStr);
      const customEnd = endDateStr ? new Date(endDateStr) : new Date();
      customStart.setUTCHours(0, 0, 0, 0);
      customEnd.setUTCHours(23, 59, 59, 999);
      return { start: customStart, end: customEnd };
    } else {
      return null;
    }

    return { start, end };
  }

  private filterByDateRange(items: any[], dateKeys: string[], range: { start: Date; end: Date } | null): any[] {
    if (!range) return items;
    return items.filter(item => {
      let val: any = null;
      for (const key of dateKeys) {
        if (item[key]) {
          val = item[key];
          break;
        }
      }
      if (!val) val = item.createdAt || item.updatedAt;
      if (!val) return true;
      const date = new Date(val);
      return date >= range.start && date <= range.end;
    });
  }

  // --- REST CLIENT METHOD HELPERS ---

  private async fetchIssues(authHeader?: string): Promise<any[]> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues?limit=1000`, this.getHeaders(authHeader))
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch issues: ${error.message}`);
      return [];
    }
  }

  private async fetchMembers(authHeader?: string): Promise<any[]> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members?limit=1000`, this.getHeaders(authHeader))
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch members: ${error.message}`);
      return [];
    }
  }

  private async fetchStaff(authHeader?: string): Promise<any[]> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/staff?limit=1000`, this.getHeaders(authHeader))
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch staff: ${error.message}`);
      return [];
    }
  }

  private async fetchAttendance(authHeader?: string): Promise<any[]> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/attendance/all`, this.getHeaders(authHeader))
      );
      return response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch attendance: ${error.message}`);
      return [];
    }
  }

  private async fetchFines(authHeader?: string): Promise<any[]> {
    try {
      const paymentsServiceUrl = process.env.PAYMENTS_SERVICE_URL || 'http://library-payments-service:3005';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${paymentsServiceUrl}/fines?limit=1000`, this.getHeaders(authHeader))
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch fines: ${error.message}`);
      return [];
    }
  }

  private async fetchRequests(authHeader?: string): Promise<any[]> {
    try {
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://library-requests-service:3014';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${requestsServiceUrl}/requests?limit=1000`, this.getHeaders(authHeader))
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch requests: ${error.message}`);
      return [];
    }
  }

  private async fetchSuggestions(authHeader?: string): Promise<any[]> {
    try {
      const requestsServiceUrl = process.env.REQUESTS_SERVICE_URL || 'http://library-requests-service:3014';
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${requestsServiceUrl}/suggestions`, this.getHeaders(authHeader))
      );
      return response.data || [];
    } catch (error) {
      this.logger.error(`Failed to fetch suggestions: ${error.message}`);
      return [];
    }
  }

  // --- REPORT EXPORTERS ---

  // 1. OVERVIEW REPORT
  async getOverviewReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [books, reviews, issues, members, staff, attendance, fines] = await Promise.all([
      this.bookModel.find().exec(),
      this.bookReviewModel.find().exec(),
      this.fetchIssues(authHeader),
      this.fetchMembers(authHeader),
      this.fetchStaff(authHeader),
      this.fetchAttendance(authHeader),
      this.fetchFines(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredIssues = this.filterByDateRange(issues, ['issueDate'], range);
    const filteredReturns = this.filterByDateRange(issues, ['returnDate'], range);
    const filteredFines = this.filterByDateRange(fines, ['createdAt'], range);
    const filteredAttendance = this.filterByDateRange(attendance, ['checkInTime', 'date', 'createdAt'], range);
    const filteredMembers = this.filterByDateRange(members, ['createdAt'], range);

    // KPI: Total Book Value
    const totalBookValue = books.reduce((sum, book) => sum + ((book.price || 150) * (book.quantity || 1)), 0);

    // KPI: Total Books Issued
    const totalBooksIssued = filteredIssues.length;

    // KPI: Active Members (Total current active members)
    const activeMembersCount = members.filter(m => m.status?.toUpperCase() === 'ACTIVE' || m.status?.toLowerCase() === 'active' || m.isActive).length;

    // KPI: Revenue Collected
    const revenueCollected = filteredFines
      .filter(f => f.status?.toUpperCase() === 'PAID' || f.status === 'Paid')
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    // Activity Trend (Issues vs Returns over last 7 days)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityTrend = days.map((day, idx) => {
      const dayIssues = filteredIssues.filter(iss => new Date(iss.issueDate).getDay() === (idx + 1) % 7).length;
      const dayReturns = filteredReturns.filter(iss => iss.returnDate && new Date(iss.returnDate).getDay() === (idx + 1) % 7).length;
      return {
        day,
        issues: dayIssues,
        returns: dayReturns,
      };
    });

    // Hourly activity
    const hourlyDistribution: Record<string, { issues: number; returns: number }> = {
      '09:00': { issues: 0, returns: 0 },
      '11:00': { issues: 0, returns: 0 },
      '13:00': { issues: 0, returns: 0 },
      '15:00': { issues: 0, returns: 0 },
      '17:00': { issues: 0, returns: 0 },
      '19:00': { issues: 0, returns: 0 },
    };
    filteredIssues.forEach(iss => {
      const hour = new Date(iss.issueDate).getHours();
      let slot = '09:00';
      if (hour >= 19) slot = '19:00';
      else if (hour >= 17) slot = '17:00';
      else if (hour >= 15) slot = '15:00';
      else if (hour >= 13) slot = '13:00';
      else if (hour >= 11) slot = '11:00';
      if (hourlyDistribution[slot]) hourlyDistribution[slot].issues++;
    });
    filteredReturns.forEach(iss => {
      if (iss.returnDate) {
        const hour = new Date(iss.returnDate).getHours();
        let slot = '09:00';
        if (hour >= 19) slot = '19:00';
        else if (hour >= 17) slot = '17:00';
        else if (hour >= 15) slot = '15:00';
        else if (hour >= 13) slot = '13:00';
        else if (hour >= 11) slot = '11:00';
        if (hourlyDistribution[slot]) hourlyDistribution[slot].returns++;
      }
    });
    const hourlyData = Object.entries(hourlyDistribution).map(([time, val]) => ({
      time,
      issues: val.issues,
      returns: val.returns,
    }));

    // Popular Categories
    const categoryCounts: Record<string, number> = {};
    books.forEach(b => {
      if (b.category) {
        categoryCounts[b.category] = (categoryCounts[b.category] || 0) + (b.quantity || 1);
      }
    });
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'];
    const categoryData = Object.entries(categoryCounts).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length],
    }));

    // Staff Attendance Overview
    const presentStaffIds = new Set(filteredAttendance
      .filter(a => a.status?.toLowerCase() === 'present' || a.status?.toUpperCase() === 'PRESENT' || a.checkInTime)
      .map(a => {
        const aStaffId = typeof a.staffId === 'object' && a.staffId !== null ? (a.staffId._id || a.staffId.id) : a.staffId;
        return aStaffId?.toString();
      })
      .filter(Boolean)
    );
    const presentStaff = presentStaffIds.size;
    const totalStaffCount = staff.length;
    const absentStaff = Math.max(0, totalStaffCount - presentStaff);

    const staffList = staff.map(s => {
      const isPresent = filteredAttendance.some(a => {
        const aStaffId = typeof a.staffId === 'object' && a.staffId !== null ? (a.staffId._id || a.staffId.id) : a.staffId;
        const sId = s._id || s.id;
        const isActuallyPresent = a.status?.toLowerCase() === 'present' || a.status?.toUpperCase() === 'PRESENT' || !!a.checkInTime;
        return aStaffId?.toString() === sId?.toString() && isActuallyPresent;
      });
      return {
        name: s.fullName || s.name || 'Staff User',
        status: isPresent ? 'In' : 'Out',
      };
    }).slice(0, 5);

    // Present Staff list for dynamic efficiency distribution
    const presentStaffList = staff.filter(s => filteredAttendance.some(a => {
      const aStaffId = typeof a.staffId === 'object' && a.staffId !== null ? (a.staffId._id || a.staffId.id) : a.staffId;
      const sId = s._id || s.id;
      const isActuallyPresent = a.status?.toLowerCase() === 'present' || a.status?.toUpperCase() === 'PRESENT' || !!a.checkInTime;
      return aStaffId?.toString() === sId?.toString() && isActuallyPresent;
    }));
    const presentCount = presentStaffList.length;

    // Staff Efficiency calculated dynamically
    const staffEfficiency = staff.map((s, idx) => {
      const isPresent = filteredAttendance.some(a => {
        const aStaffId = typeof a.staffId === 'object' && a.staffId !== null ? (a.staffId._id || a.staffId.id) : a.staffId;
        const sId = s._id || s.id;
        const isActuallyPresent = a.status?.toLowerCase() === 'present' || a.status?.toUpperCase() === 'PRESENT' || !!a.checkInTime;
        return aStaffId?.toString() === sId?.toString() && isActuallyPresent;
      });
      let processed = 0;
      if (isPresent && presentCount > 0) {
        const staffIndex = presentStaffList.findIndex(ps => (ps._id || ps.id)?.toString() === (s._id || s.id)?.toString());
        const totalTasks = filteredIssues.length + filteredFines.length;
        processed = Math.floor(totalTasks / presentCount) + (staffIndex < (totalTasks % presentCount) ? 1 : 0);
      }
      return {
        name: (s.fullName || s.name || 'Staff User').split(' ')[0],
        score: processed > 0 ? Math.min(100, 92 + (processed % 7)) : 0,
        tasks: processed,
      };
    }).sort((a, b) => b.tasks - a.tasks).slice(0, 3);

    // Revenue Breakdown
    const overdueFines = filteredFines.filter(f => f.reason?.toLowerCase() === 'overdue').reduce((sum, f) => sum + (f.amount || 0), 0);
    const damageFines = filteredFines.filter(f => f.reason?.toLowerCase() === 'damage').reduce((sum, f) => sum + (f.amount || 0), 0);
    const lostFines = filteredFines.filter(f => f.reason?.toLowerCase() === 'lost').reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalFines = overdueFines + damageFines + lostFines || 1;

    const revenueBreakdown = [
      { label: 'Overdue Fines', val: `₹${overdueFines.toLocaleString()}`, pct: Math.round((overdueFines / totalFines) * 100), col: 'bg-amber-500' },
      { label: 'Lost Books', val: `₹${lostFines.toLocaleString()}`, pct: Math.round((lostFines / totalFines) * 100), col: 'bg-blue-500' },
      { label: 'Damage Fines', val: `₹${damageFines.toLocaleString()}`, pct: Math.round((damageFines / totalFines) * 100), col: 'bg-rose-500' },
    ];

    // Most Borrowed Today
    const bookBorrows: Record<string, number> = {};
    filteredIssues.forEach(iss => {
      const bId = iss.bookId?.toString();
      bookBorrows[bId] = (bookBorrows[bId] || 0) + 1;
    });

    const mostBorrowedToday = Object.entries(bookBorrows)
      .map(([bId, count]) => {
        const bookObj = books.find(b => b._id.toString() === bId);
        return {
          t: bookObj?.title || 'Unknown Book Title',
          n: count,
        };
      })
      .sort((a, b) => b.n - a.n)
      .slice(0, 3);

    // Active Members Today
    const memberBorrows: Record<string, number> = {};
    filteredIssues.forEach(iss => {
      const mId = iss.memberId?.toString();
      memberBorrows[mId] = (memberBorrows[mId] || 0) + 1;
    });

    const activeMembersToday = Object.entries(memberBorrows)
      .map(([mId, count]) => {
        const memObj = members.find(m => m._id?.toString() === mId || m.id?.toString() === mId);
        return {
          m: memObj?.fullName || memObj?.name || 'Library Member',
          b: count,
        };
      })
      .sort((a, b) => b.b - a.b)
      .slice(0, 3);

    // Recent Transactions
    const recentTransactions = filteredFines.map(f => {
      const mem = members.find(m => m._id?.toString() === f.memberId?.toString() || m.id?.toString() === f.memberId?.toString());
      return {
        name: mem?.fullName || mem?.name || 'Library Member',
        reason: f.reason || 'Overdue',
        amount: `₹${f.amount}`,
        time: new Date(f.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
        id: f.invoiceId || `INV-${f._id.toString().substring(18).toUpperCase()}`,
      };
    }).slice(0, 5);

    return {
      kpis: {
        totalBookValue,
        totalBooksIssued,
        activeMembers: activeMembersCount || members.length || 0,
        revenueCollected,
      },
      activityTrend,
      hourlyActivity: hourlyData,
      categoryDistribution: categoryData,
      staffAttendance: {
        present: presentStaff,
        absent: absentStaff,
        list: staffList,
      },
      staffEfficiency,
      revenueBreakdown,
      mostBorrowedToday,
      activeMembersToday,
      recentTransactions,
    };
  }

  // 2. STAFF PERFORMANCE REPORT
  async getStaffReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [staff, attendance, issues] = await Promise.all([
      this.fetchStaff(authHeader),
      this.fetchAttendance(authHeader),
      this.fetchIssues(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredAttendance = this.filterByDateRange(attendance, ['clockIn'], range);
    const filteredIssues = this.filterByDateRange(issues, ['issueDate'], range);

    const totalStaff = staff.length;
    const presentStaff = filteredAttendance.filter(a => a.status === 'Present' || a.clockIn).length;
    const avgAttendance = staff.length > 0 ? Math.round((presentStaff / staff.length) * 100) : 0;

    const mockAttendanceData = [
      { name: 'Mon', present: presentStaff },
      { name: 'Tue', present: presentStaff },
      { name: 'Wed', present: presentStaff },
      { name: 'Thu', present: presentStaff },
      { name: 'Fri', present: presentStaff },
      { name: 'Sat', present: presentStaff },
    ];

    const productivityData = staff.map((s, idx) => ({
      name: s.fullName || s.name || 'Staff User',
      booksProcessed: filteredIssues.filter(iss => iss.handledBy?.toString() === s._id?.toString() || iss.employeeId?.toString() === s._id?.toString()).length || 0,
      accuracy: 90 + (idx % 2) * 5,
      responseTime: 8 + (idx % 3) * 2,
    }));

    return {
      stats: {
        totalStaff,
        avgAttendance,
        avgWorkingHours: 8,
        lateComers: filteredAttendance.filter(a => a.status === 'Late' || a.isLate).length || 0,
      },
      attendanceTrends: mockAttendanceData,
      productivity: productivityData,
      details: productivityData,
    };
  }

  // 3. BOOK PERFORMANCE REPORT
  async getBooksReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [books, reviews, issues] = await Promise.all([
      this.bookModel.find().exec(),
      this.bookReviewModel.find().exec(),
      this.fetchIssues(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredIssues = this.filterByDateRange(issues, ['issueDate'], range);
    const filteredReviews = this.filterByDateRange(reviews, ['reviewDate', 'createdAt'], range);

    const totalBorrows = filteredIssues.length;
    const avgRating = filteredReviews.length > 0 ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1) : '0';

    // Calculate borrows by categories
    const categoryBorrows: Record<string, number> = {};
    filteredIssues.forEach(iss => {
      const bId = iss.bookId?.toString();
      const bookObj = books.find(b => b._id.toString() === bId);
      if (bookObj && bookObj.category) {
        categoryBorrows[bookObj.category] = (categoryBorrows[bookObj.category] || 0) + 1;
      }
    });
    const categoryFractions = Object.entries(categoryBorrows).map(([name, value]) => ({
      name,
      value,
    }));

    // Popular Books borrows count
    const borrowCounts: Record<string, number> = {};
    filteredIssues.forEach(iss => {
      const bId = iss.bookId?.toString();
      borrowCounts[bId] = (borrowCounts[bId] || 0) + 1;
    });

    const popularBooks = Object.entries(borrowCounts).map(([bId, count]) => {
      const bookObj = books.find(b => b._id.toString() === bId);
      return {
        name: bookObj?.title || 'Unknown Book Title',
        borrows: count,
        category: bookObj?.category || 'General',
      };
    }).sort((a, b) => b.borrows - a.borrows).slice(0, 5);

    return {
      stats: {
        totalBorrows,
        growthRate: 0,
        newBooksRead: books.length,
        avgRating,
      },
      reasons: categoryFractions,
      popularBooks,
      detailedBookAnalytics: popularBooks,
    };
  }

  // 4. MEMBER ENGAGEMENT REPORT
  async getMembersReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [members, issues] = await Promise.all([
      this.fetchMembers(authHeader),
      this.fetchIssues(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredMembers = this.filterByDateRange(members, ['createdAt'], range);
    const filteredIssues = this.filterByDateRange(issues, ['issueDate'], range);

    const activeMembers = filteredMembers.filter(m => m.status === 'Active' || m.isActive).length;
    const avgBooksPerMember = filteredMembers.length > 0 ? (filteredIssues.length / filteredMembers.length).toFixed(1) : '0';

    // Group members by registration month to show actual growth
    const monthCounts: Record<string, number> = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0 };
    filteredMembers.forEach(m => {
      const date = m.createdAt ? new Date(m.createdAt) : new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      if (monthCounts[month] !== undefined) {
        monthCounts[month]++;
      }
    });
    
    let runningTotal = 0;
    const actualMembershipGrowth = Object.entries(monthCounts).map(([name, count]) => {
      runningTotal += count;
      return {
        name,
        members: runningTotal,
      };
    });

    const memberActivity = filteredMembers.map((m, idx) => ({
      name: m.fullName || m.name || 'Member',
      books: filteredIssues.filter(iss => iss.memberId?.toString() === m._id?.toString()).length || 0,
      frequency: filteredIssues.filter(iss => iss.memberId?.toString() === m._id?.toString()).length || 0,
      score: m.status === 'Active' ? 95 : 50,
    })).sort((a, b) => b.books - a.books).slice(0, 5);

    return {
      stats: {
        activeMembers,
        avgBooksPerMember,
        retentionRate: activeMembers > 0 ? Math.round((activeMembers / filteredMembers.length) * 100) : 0,
        topMemberScore: memberActivity[0]?.score || 0,
      },
      growthTrend: actualMembershipGrowth,
      engagementMatrix: memberActivity,
      topMembers: memberActivity,
    };
  }

  // 5. PAYMENT FINANCIAL REPORT
  async getPaymentsReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [fines, members] = await Promise.all([
      this.fetchFines(authHeader),
      this.fetchMembers(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredFines = this.filterByDateRange(fines, ['createdAt'], range);
    const filteredMembers = this.filterByDateRange(members, ['createdAt'], range);

    const totalFinesCollected = filteredFines.filter(f => f.status?.toUpperCase() === 'PAID' || f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
    const unpaidFines = filteredFines.filter(f => f.status?.toUpperCase() === 'PENDING' || f.status?.toUpperCase() === 'UNPAID' || f.status === 'Pending' || f.status === 'Unpaid').reduce((sum, f) => sum + (f.amount || 0), 0);

    const revenueTrend = [
      { name: 'Mon', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 1).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Tue', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 2).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Wed', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 3).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Thu', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 4).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Fri', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 5).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Sat', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 6).reduce((sum, f) => sum + (f.amount || 0), 0) },
      { name: 'Sun', revenue: filteredFines.filter(f => new Date(f.createdAt).getDay() === 0).reduce((sum, f) => sum + (f.amount || 0), 0) },
    ];

    const overdueVal = filteredFines.filter(f => f.reason?.toLowerCase() === 'overdue').reduce((sum, f) => sum + (f.amount || 0), 0);
    const damageVal = filteredFines.filter(f => f.reason?.toLowerCase() === 'damage').reduce((sum, f) => sum + (f.amount || 0), 0);
    const lostVal = filteredFines.filter(f => f.reason?.toLowerCase() === 'lost').reduce((sum, f) => sum + (f.amount || 0), 0);

    const fineBreakdown = [
      { name: 'Overdue', value: overdueVal, count: filteredFines.filter(f => f.reason?.toLowerCase() === 'overdue').length },
      { name: 'Damage', value: damageVal, count: filteredFines.filter(f => f.reason?.toLowerCase() === 'damage').length },
      { name: 'Lost', value: lostVal, count: filteredFines.filter(f => f.reason?.toLowerCase() === 'lost').length },
    ];

    const cashVal = filteredFines.filter(f => f.paymentMethod?.toUpperCase() === 'CASH' || f.paymentMethod === 'Cash').reduce((sum, f) => sum + (f.amount || 0), 0);
    const upiVal = filteredFines.filter(f => f.paymentMethod?.toUpperCase() === 'UPI' || f.paymentMethod === 'UPI').reduce((sum, f) => sum + (f.amount || 0), 0);
    const cardVal = filteredFines.filter(f => f.paymentMethod?.toUpperCase() === 'CARD' || f.paymentMethod === 'Card').reduce((sum, f) => sum + (f.amount || 0), 0);

    const paymentMethods = [
      { name: 'Cash', value: cashVal },
      { name: 'UPI', value: upiVal },
      { name: 'Card', value: cardVal },
    ];

    const detailedPayments = filteredFines.map(f => {
      const mem = filteredMembers.find(m => m._id.toString() === f.memberId?.toString());
      return {
        id: f.invoiceId || `INV-${f._id.toString().substring(18).toUpperCase()}`,
        member: mem?.fullName || mem?.name || 'Library Member',
        amount: f.amount || 0,
        reason: f.reason ? (f.reason.charAt(0).toUpperCase() + f.reason.slice(1).toLowerCase()) : 'Overdue',
        method: f.paymentMethod || 'UPI',
        date: new Date(f.createdAt).toISOString().split('T')[0],
        status: f.status ? (f.status.charAt(0).toUpperCase() + f.status.slice(1).toLowerCase()) : 'Paid',
      };
    }).slice(0, 5);

    return {
      stats: {
        totalFinesCollected,
        totalBookValue: 0,
        unpaidFines,
      },
      revenueTrend,
      fineBreakdown,
      paymentMethods,
      detailedPayments,
    };
  }

  // 6. REQUESTS & TRENDS REPORT
  async getRequestsReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [requests, suggestions, members] = await Promise.all([
      this.fetchRequests(authHeader),
      this.fetchSuggestions(authHeader),
      this.fetchMembers(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredRequests = this.filterByDateRange(requests, ['createdAt'], range);
    const filteredSuggestions = this.filterByDateRange(suggestions, ['createdAt'], range);
    const filteredMembers = this.filterByDateRange(members, ['createdAt'], range);

    const totalBookRequests = filteredRequests.length;
    const totalSuggestions = filteredSuggestions.length;

    const approvedCount = filteredRequests.filter(r => r.status === 'Approved').length;
    const fulfilledCount = filteredRequests.filter(r => r.status === 'Fulfilled').length;
    const pendingCount = filteredRequests.filter(r => r.status === 'Pending').length;
    const rejectedCount = filteredRequests.filter(r => r.status === 'Rejected').length;
    const totalReqs = approvedCount + fulfilledCount + pendingCount + rejectedCount;
    const approvalRate = totalReqs > 0 ? Math.round(((approvedCount + fulfilledCount) / totalReqs) * 100) : 0;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const actualRequestTrend = days.map((day, idx) => {
      const reqCount = filteredRequests.filter(r => new Date(r.createdAt).getDay() === (idx + 1) % 7).length;
      const sugCount = filteredSuggestions.filter(s => new Date(s.createdAt).getDay() === (idx + 1) % 7).length;
      return {
        name: day,
        requests: reqCount,
        suggestions: sugCount,
      };
    });

    const statusDistribution = [
      { name: 'Pending', count: pendingCount },
      { name: 'Approved', count: approvedCount },
      { name: 'Rejected', count: rejectedCount },
      { name: 'Fulfilled', count: fulfilledCount },
    ];

    const recentRequests = filteredRequests.map(r => {
      const mem = filteredMembers.find(m => m._id.toString() === r.memberId?.toString());
      return {
        title: r.title || 'Requested Book',
        user: mem?.fullName || mem?.name || 'Library Member',
        type: 'Request',
        date: new Date(r.createdAt || Date.now()).toISOString().split('T')[0],
        status: r.status || 'Pending',
      };
    }).slice(0, 5);

    return {
      stats: {
        totalBookRequests,
        totalSuggestions,
        approvalRate,
        avgDecisionTime: '0 Days',
      },
      requestTrend: actualRequestTrend,
      statusDistribution,
      recentRequests,
    };
  }

  // 7. BOOK REVIEWS REPORT
  async getReviewsReport(authHeader?: string, filterType?: string, startDate?: string, endDate?: string): Promise<any> {
    const [reviews, books, members] = await Promise.all([
      this.bookReviewModel.find().exec(),
      this.bookModel.find().exec(),
      this.fetchMembers(authHeader),
    ]);

    const range = this.getFilterDateRange(filterType, startDate, endDate);
    const filteredReviews = this.filterByDateRange(reviews, ['reviewDate', 'createdAt'], range);
    const filteredMembers = this.filterByDateRange(members, ['createdAt'], range);

    const totalReviews = filteredReviews.length;
    const sumRatings = filteredReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = filteredReviews.length > 0 ? (sumRatings / filteredReviews.length).toFixed(1) : '0';

    const starCounts = [0, 0, 0, 0, 0];
    filteredReviews.forEach(r => {
      const idx = Math.min(4, Math.max(0, Math.floor(r.rating) - 1));
      starCounts[idx]++;
    });

    const ratingDistribution = [
      { rating: '5 Stars', count: starCounts[4], color: '#10B981' },
      { rating: '4 Stars', count: starCounts[3], color: '#3B82F6' },
      { rating: '3 Stars', count: starCounts[2], color: '#F59E0B' },
      { rating: '2 Stars', count: starCounts[1], color: '#EF4444' },
      { rating: '1 Star', count: starCounts[0], color: '#991B1B' },
    ];

    // Top rated books
    const bookRatings: Record<string, { sum: number; count: number }> = {};
    filteredReviews.forEach(r => {
      const bId = r.bookId?.toString();
      if (!bookRatings[bId]) {
        bookRatings[bId] = { sum: 0, count: 0 };
      }
      bookRatings[bId].sum += r.rating;
      bookRatings[bId].count++;
    });

    const topRatedBooks = Object.entries(bookRatings).map(([bId, item]) => {
      const bookObj = books.find(b => b._id.toString() === bId);
      return {
        title: bookObj?.title || 'Book Title',
        rating: parseFloat((item.sum / item.count).toFixed(1)),
        reviews: item.count,
      };
    }).sort((a, b) => b.rating - a.rating).slice(0, 4);

    // Recent reviews feed
    const recentReviews = filteredReviews.map(r => {
      const bookObj = books.find(b => b._id.toString() === r.bookId?.toString());
      return {
        id: r._id.toString(),
        book: bookObj?.title || 'Book Title',
        member: r.memberName || 'Library Member',
        rating: r.rating,
        comment: r.review,
        date: new Date(r.reviewDate).toLocaleDateString('en-IN'),
      };
    }).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

    return {
      stats: {
        avgRating,
        totalReviews,
        positiveFeedback: totalReviews > 0 ? Math.round((filteredReviews.filter(r => r.rating >= 4).length / totalReviews) * 100) : 0,
      },
      ratingDistribution,
      topRatedBooks,
      recentReviews,
    };
  }

  // --- LEGACY COMPATIBILITY METHODS ---

  async getDailyIssueReturnReport(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split('T')[0];

    const [booksIssued, booksReturned] = await Promise.all([
      this.getTodayIssuesCount(),
      this.getTodayReturnsCount(),
    ]);

    return {
      date: dateStr,
      booksIssued,
      booksReturned,
    };
  }

  async getOverdueReport(): Promise<any> {
    const booksOverdue = await this.getOverdueBooksCount();
    return {
      overdueStatus: booksOverdue > 0 ? 1 : 0,
      booksOverdue,
    };
  }

  async getRackInventoryReport(): Promise<any[]> {
    const books = await this.bookModel.find().exec();
    const rackMap: Record<string, any> = {};
    const bookIssueCounts = await this.getAllBookIssueCounts();

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
      const bookId = book._id.toString();
      const issuedCount = bookIssueCounts[bookId] || 0;
      const availableCount = Math.max(0, quantity - issuedCount);

      rackMap[rackNumber].total += quantity;
      rackMap[rackNumber].available += availableCount;
      rackMap[rackNumber].issued += issuedCount;
    }

    for (const rackNumber in rackMap) {
      const rack = rackMap[rackNumber];
      const capacity = 50;
      rack.capacityPercentage = Math.round((rack.total / capacity) * 100);
    }

    return Object.values(rackMap);
  }

  async getRackInventoryById(rackNumber: string): Promise<any> {
    const books = await this.bookModel.find({ rackNumber }).exec();
    if (books.length === 0) {
      throw new NotFoundException('Rack not found or has no books');
    }

    let total = 0;
    let available = 0;
    let issued = 0;

    for (const book of books) {
      const quantity = book.quantity || 0;
      const bookId = book._id.toString();
      const issuedCount = await this.getBookIssueCount(bookId);
      const availableCount = Math.max(0, quantity - issuedCount);

      total += quantity;
      available += availableCount;
      issued += issuedCount;
    }

    const capacity = 50;
    const capacityPercentage = Math.round((total / capacity) * 100);

    return {
      rackNumber: rackNumber,
      location: 'Main Hall',
      total,
      available,
      issued,
      capacityPercentage,
    };
  }

  async getMemberActivityReport(authHeader?: string): Promise<any> {
    const [activeMembers, inactiveMembers] = await Promise.all([
      this.getActiveMembersCount(authHeader),
      this.getInactiveMembersCount(authHeader),
    ]);

    return {
      activeMembers,
      inactiveMembers,
    };
  }

  async getAllReports(authHeader?: string): Promise<any> {
    const [dailyIssueReturn, overdue, rackInventory, memberActivity] = await Promise.all([
      this.getDailyIssueReturnReport(),
      this.getOverdueReport(),
      this.getRackInventoryReport(),
      this.getMemberActivityReport(authHeader),
    ]);

    return {
      dailyIssueReturn,
      overdue,
      rackInventory,
      memberActivity,
    };
  }

  private async getTodayIssuesCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const today = new Date().toISOString().split('T')[0];
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count?date=${today}`)
      );
      return response.data?.count || 0;
    } catch {
      return 0;
    }
  }

  private async getTodayReturnsCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const today = new Date().toISOString().split('T')[0];
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/returns/count?date=${today}`)
      );
      return response.data?.count || 0;
    } catch {
      return 0;
    }
  }

  private async getOverdueBooksCount(): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/overdue/count`)
      );
      return response.data?.count || 0;
    } catch {
      return 0;
    }
  }

  private async getBookIssueCount(bookId: string): Promise<number> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues/count/book/${bookId}`)
      );
      return response.data?.count || 0;
    } catch {
      return 0;
    }
  }

  private async getAllBookIssueCounts(): Promise<Record<string, number>> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://library-issues-service:3013';
      const response = await firstValueFrom(
        this.httpService.get(`${issuesServiceUrl}/issues`)
      );
      const issues = response.data?.data || response.data || [];
      const counts: Record<string, number> = {};
      for (const issue of issues) {
        if (issue.status !== 'Returned') {
          const bookId = issue.bookId?.toString() || issue.bookId;
          counts[bookId] = (counts[bookId] || 0) + 1;
        }
      }
      return counts;
    } catch {
      return {};
    }
  }

  private async getActiveMembersCount(authHeader?: string): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/stats/active`, this.getHeaders(authHeader))
      );
      return response.data?.data || 0;
    } catch {
      return 0;
    }
  }

  private async getInactiveMembersCount(authHeader?: string): Promise<number> {
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://library-members-service:3012';
      const response = await firstValueFrom(
        this.httpService.get(`${membersServiceUrl}/members/stats/inactive`, this.getHeaders(authHeader))
      );
      return response.data?.data || 0;
    } catch {
      return 0;
    }
  }
}
