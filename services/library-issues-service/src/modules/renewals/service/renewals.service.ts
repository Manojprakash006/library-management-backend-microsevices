import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookRenewal, BookRenewalDocument, RenewalStatus } from '../entities/book-renewal.entity';
import { CreateBookRenewalDto, UpdateBookRenewalDto } from '../dto/create-book-renewal.dto';

@Injectable()
export class RenewalsService {
  private readonly logger = new Logger(RenewalsService.name);

  constructor(
    @InjectModel(BookRenewal.name)
    private bookRenewalModel: Model<BookRenewalDocument>,
  ) {}

  async create(createBookRenewalDto: CreateBookRenewalDto): Promise<BookRenewal> {
    const { renewalId, issueId, memberId, currentDueDate, newDueDate } = createBookRenewalDto;

    const createdRenewal = new this.bookRenewalModel({
      renewalId,
      issueId: new Types.ObjectId(issueId),
      memberId: new Types.ObjectId(memberId),
      currentDueDate,
      newDueDate,
      status: RenewalStatus.PENDING,
      requestDate: new Date(),
    });

    return createdRenewal.save();
  }

  async findAll(status?: string): Promise<BookRenewal[]> {
    const filter = status ? { status } : {};

    return this.bookRenewalModel
      .find(filter)
      .populate({
        path: 'issueId',
        populate: { path: 'bookId', select: 'title author' }
      })
      .populate('memberId', 'memberId fullName email')
      .sort({ requestDate: -1 })
      .exec();
  }

  async findOne(id: string): Promise<BookRenewal> {
    const renewal = await this.bookRenewalModel
      .findById(id)
      .populate({
        path: 'issueId',
        populate: { path: 'bookId', select: 'title author' }
      })
      .populate('memberId', 'memberId fullName email')
      .exec();

    if (!renewal) {
      throw new NotFoundException('Renewal request not found');
    }

    return renewal;
  }

  async approve(id: string): Promise<BookRenewal> {
    const renewal = await this.bookRenewalModel.findById(id).exec();

    if (!renewal) {
      throw new NotFoundException('Renewal request not found');
    }

    renewal.status = RenewalStatus.APPROVED;
    renewal.processedDate = new Date();
    await renewal.save();

    return this.bookRenewalModel
      .findById(id)
      .populate({
        path: 'issueId',
        populate: { path: 'bookId', select: 'title author' }
      })
      .populate('memberId', 'memberId fullName email')
      .exec();
  }

  async reject(id: string): Promise<BookRenewal> {
    const renewal = await this.bookRenewalModel.findById(id).exec();

    if (!renewal) {
      throw new NotFoundException('Renewal request not found');
    }

    renewal.status = RenewalStatus.REJECTED;
    renewal.processedDate = new Date();
    await renewal.save();

    return this.bookRenewalModel
      .findById(id)
      .populate({
        path: 'issueId',
        populate: { path: 'bookId', select: 'title author' }
      })
      .populate('memberId', 'memberId fullName email')
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRenewalModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Renewal request not found');
    }
  }
}
