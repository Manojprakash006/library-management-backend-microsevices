import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(@InjectModel(Member.name) private memberModel: Model<MemberDocument>) {}

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

  async findAll(): Promise<Member[]> {
    return this.memberModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.memberModel.findById(id).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async findByMemberId(memberId: string): Promise<Member> {
    const member = await this.memberModel.findOne({ memberId }).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async update(id: string, updateData: Partial<CreateMemberDto>): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async remove(id: string): Promise<void> {
    const result = await this.memberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Member not found');
    }
  }

  async getCount(): Promise<number> {
    return this.memberModel.countDocuments();
  }
}
