import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookDamageReport, BookDamageReportDocument, DamageReportStatus } from '../entities/book-damage-report.entity';
import { CreateBookDamageReportDto, UpdateBookDamageReportDto } from '../dto/create-book-damage-report.dto';

@Injectable()
export class DamageReportsService {
  private readonly logger = new Logger(DamageReportsService.name);

  constructor(
    @InjectModel(BookDamageReport.name)
    private bookDamageReportModel: Model<BookDamageReportDocument>,
  ) {}

  async create(createBookDamageReportDto: CreateBookDamageReportDto): Promise<BookDamageReport> {
    const { reportId, issueId, bookId, memberId, reason, bookAmount, fineAmount, totalAmount } = createBookDamageReportDto;

    const createdReport = new this.bookDamageReportModel({
      reportId,
      issueId: new Types.ObjectId(issueId),
      bookId: new Types.ObjectId(bookId),
      memberId: new Types.ObjectId(memberId),
      reason,
      bookAmount,
      fineAmount,
      totalAmount,
      status: DamageReportStatus.PENDING,
      reportDate: new Date(),
    });

    return createdReport.save();
  }

  async findAll(status?: string): Promise<BookDamageReport[]> {
    const filter = status ? { status } : {};

    return this.bookDamageReportModel
      .find(filter)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'memberId fullName email phoneNumber')
      .populate('issueId', 'issueDate dueDate')
      .sort({ reportDate: -1 })
      .exec();
  }

  async findOne(id: string): Promise<BookDamageReport> {
    const report = await this.bookDamageReportModel
      .findById(id)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'memberId fullName email phoneNumber')
      .populate('issueId', 'issueDate dueDate')
      .exec();

    if (!report) {
      throw new NotFoundException('Damage report not found');
    }

    return report;
  }

  async approve(id: string): Promise<BookDamageReport> {
    const report = await this.bookDamageReportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException('Damage report not found');
    }

    report.status = DamageReportStatus.APPROVED;
    report.processedDate = new Date();
    await report.save();

    return this.bookDamageReportModel
      .findById(id)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'memberId fullName email phoneNumber')
      .populate('issueId', 'issueDate dueDate')
      .exec();
  }

  async reject(id: string): Promise<BookDamageReport> {
    const report = await this.bookDamageReportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException('Damage report not found');
    }

    report.status = DamageReportStatus.REJECTED;
    report.processedDate = new Date();
    await report.save();

    return this.bookDamageReportModel
      .findById(id)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'memberId fullName email phoneNumber')
      .populate('issueId', 'issueDate dueDate')
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookDamageReportModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Damage report not found');
    }
  }
}
