import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { ActivityLogService } from '../../activity-log/service/activity-log.service';

type MemberWithStats = Member & {
  booksHeld: number;
  booksAtHome: number;
  readingInsideLibrary: number;
  totalFines: number;
  paidFines: number;
  fineHistory: any[];
  hasActiveIssues: boolean;
};

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    private readonly httpService: HttpService,
    private readonly activityLogService: ActivityLogService,
  ) { }

  async create(createMemberDto: CreateMemberDto, adminId?: string): Promise<Member> {

    if (!createMemberDto.fullName || createMemberDto.fullName.trim().length < 2) {
      throw new ConflictException('Full name is required and must be at least 2 characters');
    }
    if (!createMemberDto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createMemberDto.email)) {
      throw new ConflictException('Valid email is required');
    }
    if (!createMemberDto.password || createMemberDto.password.length < 6) {
      throw new ConflictException('Password is required and must be at least 6 characters');
    }

    const existingEmail = await this.memberModel.findOne({ email: createMemberDto.email }).exec();
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const memberData = {
      name: createMemberDto.fullName,
      email: createMemberDto.email,
      phoneNumber: createMemberDto.phoneNumber,
      address: createMemberDto.address,
      password: createMemberDto.password,
    };

    const createdMember = new this.memberModel(memberData);
    const savedMember = await createdMember.save();

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'CREATE',
        entityType: 'MEMBER',
        entityId: savedMember.memberId || savedMember._id.toString(),
        details: { email: savedMember.email, name: savedMember.name }
      });
    }

    return savedMember;
  }

  async findAll(token?: string, page: number = 1, limit: number = 10): Promise<{ data: MemberWithStats[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [members, total] = await Promise.all([
      this.memberModel.find().sort({ _id: -1 }).select('-password').skip(skip).limit(limit).exec(),
      this.memberModel.countDocuments().exec(),
    ]);

    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const memberObj = member.toObject();
        const stats = await this.getMemberStatsFromIssues(member._id.toString(), token);

        return {
          ...memberObj,
          borrowingHistory: memberObj.borrowingHistory || [],
          ...stats,
          hasActiveIssues: stats.booksHeld > 0,
        } as MemberWithStats;
      })
    );

    return {
      data: membersWithStats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, token?: string): Promise<MemberWithStats> {
    const member = await this.memberModel.findById(id).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const memberObj = member.toObject();
    const stats = await this.getMemberStatsFromIssues(id, token);

    return {
      ...memberObj,
      borrowingHistory: memberObj.borrowingHistory || [],
      ...stats,
      hasActiveIssues: stats.booksHeld > 0,
    } as MemberWithStats;
  }

  async update(id: string, updateData: Partial<CreateMemberDto>, adminId?: string): Promise<Member> {
    const dataToUpdate: any = { ...updateData };

    if (updateData.fullName) {
      dataToUpdate.name = updateData.fullName;
      delete dataToUpdate.fullName;
    }

    const member = await this.memberModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).select('-password').exec();
    
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'UPDATE',
        entityType: 'MEMBER',
        entityId: member.memberId || id,
        details: { name: member.name, email: member.email, updatedFields: Object.keys(updateData) }
      });

    }

    return member;
  }

  async addBorrowingHistory(
    memberId: string,
    historyData: { bookId: string; issueId: string; borrowedAt: Date; dueDate: Date; status: 'borrowed' | 'returned' | 'overdue' }
  ): Promise<void> {
    const member = await this.memberModel.findById(memberId).exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const borrowingEntry = {
      bookId: historyData.bookId,
      issueId: historyData.issueId,
      borrowedAt: new Date(historyData.borrowedAt),
      dueDate: new Date(historyData.dueDate),
      returnedAt: undefined,
      status: historyData.status,
      fine: 0,
    };

    member.borrowingHistory = member.borrowingHistory || [];
    member.borrowingHistory.push(borrowingEntry);
    await member.save();
  }

  async updateBorrowingHistory(
    memberId: string,
    issueId: string,
    updateData: { returnedAt: Date; fine: number; status: 'borrowed' | 'returned' | 'overdue' }
  ): Promise<void> {
    const member = await this.memberModel.findById(memberId).exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const historyEntry = member.borrowingHistory?.find(h => h.issueId === issueId);
    if (!historyEntry) {
      throw new NotFoundException('Borrowing history entry not found');
    }

    historyEntry.returnedAt = new Date(updateData.returnedAt);
    historyEntry.fine = updateData.fine;
    historyEntry.status = updateData.status;

    await member.save();
  }

  async remove(id: string, adminId?: string): Promise<void> {
    const stats = await this.getMemberStatsFromIssues(id);
    if (stats.booksHeld > 0) {
      throw new ConflictException('Cannot delete member: Member has active issued books that must be returned first.');
    }

    const result = await this.memberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Member not found');
    }

    if (adminId) {
      await this.activityLogService.logAction({
        adminId,
        action: 'DELETE',
        entityType: 'MEMBER',
        entityId: result.memberId || id,
        details: { name: result.name, email: result.email }
      });

    }
  }

  async getActiveMembersCount(): Promise<number> {
    return this.memberModel.countDocuments({ isActive: true });
  }

  async getInactiveMembersCount(): Promise<number> {
    return this.memberModel.countDocuments({ isActive: false });
  }

  async getCount(): Promise<number> {
    return this.memberModel.countDocuments();
  }

  private async getMemberStatsFromIssues(memberId: string, token?: string): Promise<{
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number;
    paidFines: number;
    fineHistory: any[];
  }> {
    let totalFinesIssues = 0;
    try {
      const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';

      const statsResponse = await firstValueFrom(
        this.httpService.get<{ data: { booksAtHome: number; readingInsideLibrary: number; totalActive: number } }>(
          `${issuesServiceUrl}/issues/member/${memberId}/stats`, {
          headers: token ? { Authorization: token } : {}
        }
        )
      );

      const stats = statsResponse.data?.data || { booksAtHome: 0, readingInsideLibrary: 0, totalActive: 0 };

      const allIssuesResponse = await firstValueFrom(
        this.httpService.get<{ data: Array<{ fine?: number }> }>(`${issuesServiceUrl}/issues/member/${memberId}`, {
          headers: token ? { Authorization: token } : {}
        })
      );
      
      const allIssues = allIssuesResponse.data?.data || [];
      totalFinesIssues = allIssues.reduce((sum: number, issue: { fine?: number }) => sum + (issue.fine || 0), 0);

      let paidFines = 0;
      let unpaidFines = 0;
      let fineHistory = [];

      try {
        const paymentsServiceUrl = 'http://library-api-gateway:3000/library/payments';
        const finesResponse = await firstValueFrom(
          this.httpService.get<{ data: any[] }>(`${paymentsServiceUrl}/fines/member/${memberId}`, {
            headers: token ? { Authorization: token } : {}
          })
        );
        const fines = finesResponse.data?.data || [];
        paidFines = fines
          .filter((f: any) => f.status === 'PAID')
          .reduce((sum: number, f: any) => sum + f.amount, 0);
          
        unpaidFines = fines
          .filter((f: any) => f.status === 'UNPAID')
          .reduce((sum: number, f: any) => sum + f.amount, 0);
        
        fineHistory = fines.map((f: any) => ({
          id: f._id,
          amount: f.amount,
          reason: f.reason,
          status: f.status,
          paidAt: f.paidAt,
          paymentMethod: f.paymentMethod
        }));
      } catch (err) {
        this.logger.error(`Failed to fetch fines from payments service: ${err.message}`);
      }

      // ACCURATE BALANCE CALCULATION
      const totalFines = totalFinesIssues + unpaidFines;

      const computedStats = {
        booksHeld: stats.totalActive,
        booksAtHome: stats.booksAtHome,
        readingInsideLibrary: stats.readingInsideLibrary,
        totalFines: totalFines,
        paidFines,
        fineHistory
      };

      this.memberModel.findByIdAndUpdate(memberId, {
        ...computedStats,
        hasActiveIssues: computedStats.booksHeld > 0
      }).catch(err => this.logger.error(`Failed to sync stats to DB for member ${memberId}: ${err.message}`));

      return computedStats;
    } catch (error) {
      this.logger.error(`Failed to fetch member stats from issues service: ${error.message}`);
      return { booksHeld: 0, booksAtHome: 0, readingInsideLibrary: 0, totalFines: 0, paidFines: 0, fineHistory: [] };
    }
  }

  async getMyStats(userId: string, token: string) {
    if (!userId) {
      throw new BadRequestException('User ID is missing');
    }

    const member = await this.memberModel.findById(userId).exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const borrowingHistory = member.borrowingHistory || [];
    const totalRequests = borrowingHistory.length;
    const memberId = member._id.toString();

    let booksRead = 0;
    try {
      const issueServiceURL = 'http://library-api-gateway:3000/library/issues';
      const response = await firstValueFrom(
        this.httpService.get(`${issueServiceURL}/issues/member/${memberId}/completed-count`,
          {
            headers: { Authorization: token }
          }
        ));
      booksRead = response.data.count;
    } catch (error) {
      booksRead = 0;
    }

    const memberStats = await this.getMemberStatsFromIssues(memberId, token);

    return {
      name: member.name,
      email: member.email,
      memberId,
      phone: member.phoneNumber,
      address: member.address,
      memberSince: member.membershipDate,
      totalRequests,
      booksRead,
      memId: member.memberId,
      paidFines: memberStats.paidFines,
      fineHistory: memberStats.fineHistory,
      totalFines: memberStats.totalFines,
    };
  }
}
