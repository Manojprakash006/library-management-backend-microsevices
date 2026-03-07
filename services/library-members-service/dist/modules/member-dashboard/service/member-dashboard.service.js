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
exports.MemberDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_entity_1 = require("../../members/entities/member.entity");
let MemberDashboardService = class MemberDashboardService {
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    async getMemberStats(userId) {
        return {
            totalBorrowed: 0,
            currentlyBorrowed: 0,
            overdueBooks: 0,
            pendingRequests: 0,
        };
    }
    async getOverdueBooks(userId) {
        return [];
    }
    async getRecentRequests(userId) {
        return [];
    }
    async getCurrentlyBorrowedBooks(userId) {
        return [];
    }
    async getBookDetails(issueId) {
        return { issueId };
    }
    async getMyBooks(userId) {
        return [];
    }
    async reportBookDamage(damageDto) {
        return { message: 'Damage reported', bookId: damageDto.bookId };
    }
    async renewBook(renewDto) {
        return { message: 'Renewal requested', bookId: renewDto.bookId };
    }
    async submitReview(userId, reviewDto) {
        return { message: 'Review submitted', userId, ...reviewDto };
    }
};
exports.MemberDashboardService = MemberDashboardService;
exports.MemberDashboardService = MemberDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MemberDashboardService);
//# sourceMappingURL=member-dashboard.service.js.map