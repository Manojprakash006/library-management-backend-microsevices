import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BookRequest,
  BookRequestDocument,
  BookRequestStatus,
} from '../entities/book-request.entity';
import {
  CreateBookRequestDto,
  UpdateBookRequestDto,
} from '../dto/create-book-request.dto';

@Injectable()
export class BookRequestsService {
  private readonly logger = new Logger(BookRequestsService.name);

  constructor(
    @InjectModel(BookRequest.name)
    private bookRequestModel: Model<BookRequestDocument>,
  ) {}

  async create(
    createBookRequestDto: CreateBookRequestDto,
  ): Promise<BookRequest> {
    const { requestId, bookId, memberId, requestDate } = createBookRequestDto;

    const existingRequest = await this.bookRequestModel
      .findOne({ requestId })
      .exec();
    if (existingRequest) {
      throw new ConflictException('Request ID already exists');
    }

    const createdRequest = new this.bookRequestModel({
      requestId,
      bookId: new Types.ObjectId(bookId),
      memberId: new Types.ObjectId(memberId),
      requestDate: requestDate || new Date(),
      status: BookRequestStatus.PENDING,
      currentlyBorrowed: 0,
      totalHistory: 0,
      activeBookIds: [],
      booklistBorrowed: [],
    });

    return createdRequest.save();
  }

  async findAll(): Promise<BookRequest[]> {
    return this.bookRequestModel
      .find()
      .populate('bookId', 'title bookId author rackNumber')
      .populate('memberId', 'fullName memberId email phoneNumber membershipDate')
      .populate('processedBy', 'fullName staffId')
      .sort({ requestDate: -1 })
      .exec();
  }

  async findOne(id: string): Promise<BookRequest> {
    const bookRequest = await this.bookRequestModel
      .findById(id)
      .populate('bookId', 'title bookId author rackNumber shelfNumber')
      .populate('memberId', 'fullName memberId email phoneNumber membershipDate')
      .populate('activeBookIds')
      .populate('processedBy', 'fullName staffId')
      .exec();

    if (!bookRequest) {
      throw new NotFoundException('Book request not found');
    }

    return bookRequest;
  }

  async update(
    id: string,
    updateBookRequestDto: UpdateBookRequestDto,
  ): Promise<BookRequest> {
    const bookRequest = await this.bookRequestModel.findById(id).exec();

    if (!bookRequest) {
      throw new NotFoundException('Book request not found');
    }

    const { status, currentlyBorrowed, totalHistory } = updateBookRequestDto;

    if (status) bookRequest.status = status;
    if (currentlyBorrowed !== undefined)
      bookRequest.currentlyBorrowed = currentlyBorrowed;
    if (totalHistory !== undefined) bookRequest.totalHistory = totalHistory;

    await bookRequest.save();

    return this.bookRequestModel
      .findById(id)
      .populate('bookId', 'title bookId author')
      .populate('memberId', 'fullName memberId email')
      .exec();
  }

  async approve(id: string, processedBy: string): Promise<BookRequest> {
    const bookRequest = await this.bookRequestModel.findById(id).exec();

    if (!bookRequest) {
      throw new NotFoundException('Book request not found');
    }

    if (bookRequest.status !== BookRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    bookRequest.status = BookRequestStatus.APPROVED;
    bookRequest.processedDate = new Date();
    bookRequest.processedBy = new Types.ObjectId(processedBy);

    await bookRequest.save();

    return this.bookRequestModel
      .findById(id)
      .populate('bookId', 'title bookId author')
      .populate('memberId', 'fullName memberId email')
      .exec();
  }

  async reject(id: string, processedBy: string): Promise<BookRequest> {
    const bookRequest = await this.bookRequestModel.findById(id).exec();

    if (!bookRequest) {
      throw new NotFoundException('Book request not found');
    }

    if (bookRequest.status !== BookRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    bookRequest.status = BookRequestStatus.REJECTED;
    bookRequest.processedDate = new Date();
    bookRequest.processedBy = new Types.ObjectId(processedBy);

    await bookRequest.save();

    return this.bookRequestModel
      .findById(id)
      .populate('bookId', 'title bookId author')
      .populate('memberId', 'fullName memberId email')
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRequestModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Book request not found');
    }
  }

  async findByMember(memberId: string): Promise<BookRequest[]> {
    return this.bookRequestModel
      .find({ memberId: new Types.ObjectId(memberId) })
      .populate('bookId', 'title bookId author coverImage')
      .sort({ requestDate: -1 })
      .exec();
  }

  async cancel(id: string, memberId: string): Promise<void> {
    const bookRequest = await this.bookRequestModel.findById(id).exec();

    if (!bookRequest) {
      throw new NotFoundException('Book request not found');
    }

    if (bookRequest.memberId.toString() !== memberId) {
      throw new ForbiddenException('Not authorized to cancel this request');
    }

    if (bookRequest.status !== BookRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    await this.bookRequestModel.findByIdAndDelete(id).exec();
  }
}
