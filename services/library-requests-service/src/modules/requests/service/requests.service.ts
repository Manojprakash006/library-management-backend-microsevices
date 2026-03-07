import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookRequest, BookRequestDocument, RequestStatus } from '../entities/book-request.entity';
import { CreateBookRequestDto } from '../dto/create-book-request.dto';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(@InjectModel(BookRequest.name) private bookRequestModel: Model<BookRequestDocument>) {}

  async create(createDto: CreateBookRequestDto): Promise<BookRequest> {
    const existingRequest = await this.bookRequestModel.findOne({ requestId: createDto.requestId }).exec();
    if (existingRequest) {
      throw new ConflictException('Request ID already exists');
    }

    const bookRequest = new this.bookRequestModel({
      ...createDto,
      bookId: new Types.ObjectId(createDto.bookId),
      memberId: new Types.ObjectId(createDto.memberId),
      requestDate: createDto.requestDate || new Date(),
      status: RequestStatus.PENDING,
    });

    return bookRequest.save();
  }

  async findAll(): Promise<BookRequest[]> {
    return this.bookRequestModel.find().sort({ requestDate: -1 }).exec();
  }

  async findOne(id: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }
    return request;
  }

  async findByMember(memberId: string): Promise<BookRequest[]> {
    return this.bookRequestModel.find({ memberId: new Types.ObjectId(memberId) }).sort({ requestDate: -1 }).exec();
  }

  async update(id: string, updateDto: Partial<CreateBookRequestDto>): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be updated');
    }

    Object.assign(request, updateDto);
    return request.save();
  }

  async cancel(id: string, memberId: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.memberId.toString() !== memberId) {
      throw new BadRequestException('Not authorized to cancel this request');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    request.status = RequestStatus.CANCELLED;
    request.processedDate = new Date();
    return request.save();
  }

  async approve(id: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    request.status = RequestStatus.APPROVED;
    request.processedDate = new Date();
    return request.save();
  }

  async reject(id: string): Promise<BookRequest> {
    const request = await this.bookRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException('Book request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    request.status = RequestStatus.REJECTED;
    request.processedDate = new Date();
    return request.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRequestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Book request not found');
    }
  }
}
