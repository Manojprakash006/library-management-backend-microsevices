import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IssueBook, IssueBookDocument, IssueStatus } from '../entities/issue-book.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(@InjectModel(IssueBook.name) private issueBookModel: Model<IssueBookDocument>) {}

  async create(createIssueDto: CreateIssueDto): Promise<IssueBook> {
    const startDate = createIssueDto.issueDate ? new Date(createIssueDto.issueDate) : new Date();
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + createIssueDto.numberOfDays);

    const issuedBook = new this.issueBookModel({
      bookId: new Types.ObjectId(createIssueDto.bookId),
      memberId: new Types.ObjectId(createIssueDto.memberId),
      issueType: createIssueDto.issueType,
      numberOfDays: createIssueDto.numberOfDays,
      issueDate: startDate,
      dueDate,
      status: IssueStatus.ACTIVE,
    });

    return issuedBook.save();
  }

  async findAll(): Promise<IssueBook[]> {
    const issuedBooks = await this.issueBookModel.find().exec();
    const today = new Date();

    return issuedBooks.map((issue) => {
      const issueObj = issue.toObject();
      if (issueObj.status !== IssueStatus.RETURNED && new Date(issueObj.dueDate) < today) {
        const overdueDays = Math.ceil((today.getTime() - new Date(issueObj.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        issueObj.status = IssueStatus.OVERDUE;
        issueObj.daysOverdue = overdueDays;
        issueObj.fine = overdueDays * (issueObj.finePerDay || 10);
      }
      return issueObj as IssueBook;
    });
  }

  async findOne(id: string): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }
    return issuedBook;
  }

  async findByMember(memberId: string): Promise<IssueBook[]> {
    return this.issueBookModel.find({ memberId: new Types.ObjectId(memberId) }).exec();
  }

  async findActiveByMember(memberId: string): Promise<IssueBook[]> {
    return this.issueBookModel.find({
      memberId: new Types.ObjectId(memberId),
      status: { $in: [IssueStatus.ACTIVE, IssueStatus.OVERDUE] },
    }).exec();
  }

  async returnBook(id: string): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }

    if (issuedBook.status === IssueStatus.RETURNED) {
      throw new BadRequestException('Book already returned');
    }

    const returnDate = new Date();
    issuedBook.returnDate = returnDate;
    issuedBook.status = IssueStatus.RETURNED;

    if (returnDate > issuedBook.dueDate) {
      const overdueDays = Math.ceil((returnDate.getTime() - issuedBook.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      issuedBook.daysOverdue = overdueDays;
      issuedBook.fine = overdueDays * issuedBook.finePerDay;
    }

    return issuedBook.save();
  }

  async update(id: string, updateIssueDto: any): Promise<IssueBook> {
    const issuedBook = await this.issueBookModel.findById(id).exec();
    if (!issuedBook) {
      throw new NotFoundException('Issued book record not found');
    }

    if (updateIssueDto.numberOfDays && updateIssueDto.issueDate) {
      const startDate = new Date(updateIssueDto.issueDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + updateIssueDto.numberOfDays);
      updateIssueDto.dueDate = dueDate;
    }

    Object.assign(issuedBook, updateIssueDto);
    return issuedBook.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.issueBookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Issued book record not found');
    }
  }
}
