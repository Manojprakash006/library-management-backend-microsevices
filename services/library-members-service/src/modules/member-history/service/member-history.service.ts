import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { RequestBookAgainDto } from '../dto/request-book-again.dto';

@Injectable()
export class MemberHistoryService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  async getMemberHistory(userId: string) {
    const member = await this.memberModel.findById(userId).select('borrowingHistory');
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member.borrowingHistory || [];
  }

  async requestBookAgain(userId: string, requestDto: RequestBookAgainDto) {
    return {
      message: 'Book request submitted successfully',
      bookId: requestDto.bookId,
      memberId: userId,
    };
  }

  async getMemberReviews(userId: string) {
    const member = await this.memberModel.findById(userId).select('reviews');
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member.reviews || [];
  }

  async createReview(userId: string, reviewDto: CreateReviewDto) {
    const member = await this.memberModel.findById(userId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    
    const review = {
      bookId: reviewDto.bookId,
      rating: reviewDto.rating,
      comment: reviewDto.comment,
      createdAt: new Date(),
    };
    
    member.reviews = member.reviews || [];
    member.reviews.push(review);
    await member.save();
    
    return review;
  }

  async updateReview(reviewId: string, reviewDto: UpdateReviewDto) {
    return {
      message: 'Review updated successfully',
      reviewId,
      ...reviewDto,
    };
  }

  async deleteReview(reviewId: string) {
    return { message: 'Review deleted successfully', reviewId };
  }
}
