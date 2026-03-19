import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';

// Type that includes computed fields for member responses
type MemberWithStats = Member & {
  booksHeld: number;
  booksAtHome: number;
  readingInsideLibrary: number;
  totalFines: number;
  hasActiveIssues: boolean;
};

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    private readonly httpService: HttpService,
  ) { }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    // Validation: Check required fields
    if (!createMemberDto.fullName || createMemberDto.fullName.trim().length < 2) {
      throw new ConflictException('Full name is required and must be at least 2 characters');
    }
    if (!createMemberDto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createMemberDto.email)) {
      throw new ConflictException('Valid email is required');
    }
    if (!createMemberDto.password || createMemberDto.password.length < 6) {
      throw new ConflictException('Password is required and must be at least 6 characters');
    }

    const existingMember = await this.memberModel.findOne({ memberId: createMemberDto.memberId }).exec();
    if (existingMember) {
      throw new ConflictException('Member ID already exists');
    }

    const existingEmail = await this.memberModel.findOne({ email: createMemberDto.email }).exec();
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Map DTO fields to entity fields
    const memberData = {
      memberId: createMemberDto.memberId,
      name: createMemberDto.fullName,
      email: createMemberDto.email,
      phoneNumber: createMemberDto.phoneNumber,
      address: createMemberDto.address,
      password: createMemberDto.password,
    };

    const createdMember = new this.memberModel(memberData);
    return createdMember.save();
  }

  async findAll(): Promise<MemberWithStats[]> {
    const members = await this.memberModel.find().select('-password').exec();

    // Fetch real-time stats from issues service for each member
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const memberObj = member.toObject();
        const { booksHeld, booksAtHome, readingInsideLibrary, totalFines } = await this.getMemberStatsFromIssues(member._id.toString());

        return {
          ...memberObj,
          borrowingHistory: memberObj.borrowingHistory || [],
          booksHeld,
          booksAtHome,
          readingInsideLibrary,
          totalFines,
          hasActiveIssues: booksHeld > 0,
        };
      })
    );

    return membersWithStats;
  }

  async findOne(id: string): Promise<MemberWithStats> {
    const member = await this.memberModel.findById(id).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const memberObj = member.toObject();

    // Get real-time stats from issues service
    const { booksHeld, booksAtHome, readingInsideLibrary, totalFines } = await this.getMemberStatsFromIssues(id);

    return {
      ...memberObj,
      borrowingHistory: memberObj.borrowingHistory || [],
      booksHeld,
      booksAtHome,
      readingInsideLibrary,
      totalFines,
      hasActiveIssues: booksHeld > 0,
    };
  }

  async findByMemberId(memberId: string): Promise<MemberWithStats> {
    const member = await this.memberModel.findOne({ memberId }).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const memberObj = member.toObject();

    // Get real-time stats from issues service
    const { booksHeld, booksAtHome, readingInsideLibrary, totalFines } = await this.getMemberStatsFromIssues(member._id.toString());

    return {
      ...memberObj,
      borrowingHistory: memberObj.borrowingHistory || [],
      booksHeld,
      booksAtHome,
      readingInsideLibrary,
      totalFines,
      hasActiveIssues: booksHeld > 0,
    };
  }

  async update(id: string, updateData: Partial<CreateMemberDto>): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
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

  async remove(id: string): Promise<void> {
    const result = await this.memberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Member not found');
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

  private async getMemberStatsFromIssues(memberId: string): Promise<{
    booksHeld: number;
    booksAtHome: number;
    readingInsideLibrary: number;
    totalFines: number
  }> {
    try {
      const issuesServiceUrl = process.env.ISSUES_SERVICE_URL || 'http://localhost:3013';

      // Get detailed stats from new endpoint
      const statsResponse = await firstValueFrom(
        this.httpService.get<{ data: { booksAtHome: number; readingInsideLibrary: number; totalActive: number } }>(
          `${issuesServiceUrl}/issues/member/${memberId}/stats`
        )
      );

      const stats = statsResponse.data?.data || { booksAtHome: 0, readingInsideLibrary: 0, totalActive: 0 };

      // Get all issues to calculate total fines
      const allIssuesResponse = await firstValueFrom(
        this.httpService.get<{ data: Array<{ fine?: number }> }>(`${issuesServiceUrl}/issues/member/${memberId}`)
      );
      const allIssues = allIssuesResponse.data?.data || [];
      const totalFines = allIssues.reduce((sum: number, issue: { fine?: number }) => sum + (issue.fine || 0), 0);

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
}
