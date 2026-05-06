"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberHistoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_entity_1 = require("../../members/entities/member.entity");
let MemberHistoryService = class MemberHistoryService {
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    async getMemberHistory(userId) {
        const member = await this.memberModel.findById(userId).select('borrowingHistory');
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member.borrowingHistory || [];
    }
    async requestBookAgain(userId, requestDto) {
        return {
            message: 'Book request submitted successfully',
            bookId: requestDto.bookId,
            memberId: userId,
        };
    }
    async getMemberReviews(userId) {
        const member = await this.memberModel.findById(userId).select('reviews');
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        return member.reviews || [];
    }
    async createReview(userId, reviewDto) {
        const member = await this.memberModel.findById(userId);
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
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
    async updateReview(reviewId, reviewDto) {
        return {
            message: 'Review updated successfully',
            reviewId,
            ...reviewDto,
        };
    }
    async deleteReview(reviewId) {
        return { message: 'Review deleted successfully', reviewId };
    }
};
exports.MemberHistoryService = MemberHistoryService;
exports.MemberHistoryService = MemberHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MemberHistoryService);
//# sourceMappingURL=member-history.service.js.map