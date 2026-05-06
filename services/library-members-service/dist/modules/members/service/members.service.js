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
var MembersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const member_entity_1 = require("../entities/member.entity");
const activity_log_service_1 = require("../../activity-log/service/activity-log.service");
const redis_emitter_service_1 = require("../../redis-emitter/redis-emitter.service");
let MembersService = MembersService_1 = class MembersService {
    constructor(memberModel, httpService, activityLogService, redisEmitter) {
        this.memberModel = memberModel;
        this.httpService = httpService;
        this.activityLogService = activityLogService;
        this.redisEmitter = redisEmitter;
        this.logger = new common_1.Logger(MembersService_1.name);
    }
    async create(createMemberDto, adminId) {
        if (!createMemberDto.fullName || createMemberDto.fullName.trim().length < 2) {
            throw new common_1.ConflictException('Full name is required and must be at least 2 characters');
        }
        if (!createMemberDto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createMemberDto.email)) {
            throw new common_1.ConflictException('Valid email is required');
        }
        if (!createMemberDto.password || createMemberDto.password.length < 6) {
            throw new common_1.ConflictException('Password is required and must be at least 6 characters');
        }
        const existingEmail = await this.memberModel.findOne({ email: createMemberDto.email }).exec();
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const memberData = {
            name: createMemberDto.fullName,
            email: createMemberDto.email,
            phoneNumber: createMemberDto.phoneNumber,
            address: createMemberDto.address,
            password: createMemberDto.password,
        };
        const createdMember = new this.memberModel(memberData);
        const savedMember = await createdMember.save();
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'CREATE',
                entityType: 'MEMBER',
                entityId: savedMember.memberId || savedMember._id.toString(),
            });
        }
        await this.redisEmitter.emit('MEMBERS_UPDATED', { action: 'create', memberId: savedMember._id });
        return savedMember;
    }
    async findAll(token, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [members, total] = await Promise.all([
            this.memberModel.find().select('-password').sort({ _id: -1 }).skip(skip).limit(limit).exec(),
            this.memberModel.countDocuments().exec(),
        ]);
        const membersWithStats = await Promise.all(members.map(async (member) => {
            const memberObj = member.toObject();
            const stats = await this.getMemberStatsFromIssues(member._id.toString(), token);
            return {
                ...memberObj,
                borrowingHistory: memberObj.borrowingHistory || [],
                ...stats,
                hasActiveIssues: stats.booksHeld > 0,
            };
        }));
        return {
            data: membersWithStats,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, token) {
        const member = await this.memberModel.findById(id).select('-password').exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        const memberObj = member.toObject();
        const stats = await this.getMemberStatsFromIssues(id, token);
        return {
            ...memberObj,
            borrowingHistory: memberObj.borrowingHistory || [],
            ...stats,
            hasActiveIssues: stats.booksHeld > 0,
        };
    }
    async update(id, updateData, adminId) {
        const dataToUpdate = { ...updateData };
        if (updateData.fullName) {
            dataToUpdate.name = updateData.fullName;
            delete dataToUpdate.fullName;
        }
        const member = await this.memberModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).select('-password').exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'UPDATE',
                entityType: 'MEMBER',
                entityId: member.memberId || id,
                details: { name: member.name, email: member.email, updatedFields: Object.keys(updateData) }
            });
        }
        await this.redisEmitter.emit('MEMBERS_UPDATED', { action: 'update', memberId: id });
        return member;
    }
    async addBorrowingHistory(memberId, historyData) {
        const member = await this.memberModel.findById(memberId).exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
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
    async updateBorrowingHistory(memberId, issueId, updateData) {
        const member = await this.memberModel.findById(memberId).exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        const historyEntry = member.borrowingHistory?.find(h => h.issueId === issueId);
        if (!historyEntry) {
            throw new common_1.NotFoundException('Borrowing history entry not found');
        }
        historyEntry.returnedAt = new Date(updateData.returnedAt);
        historyEntry.fine = updateData.fine;
        historyEntry.status = updateData.status;
        await member.save();
    }
    async remove(id, adminId) {
        const stats = await this.getMemberStatsFromIssues(id);
        if (stats.booksHeld > 0) {
            throw new common_1.ConflictException('Cannot delete member: Member has active issued books that must be returned first.');
        }
        const result = await this.memberModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'DELETE',
                entityType: 'MEMBER',
                entityId: result.memberId || id,
                details: { name: result.name, email: result.email }
            });
        }
        await this.redisEmitter.emit('MEMBERS_UPDATED', { action: 'delete', memberId: id });
    }
    async getActiveMembersCount() {
        return this.memberModel.countDocuments({ isActive: true });
    }
    async getInactiveMembersCount() {
        return this.memberModel.countDocuments({ isActive: false });
    }
    async getActiveMembersCount() {
        return this.memberModel.countDocuments({ isActive: true });
    }
    async getInactiveMembersCount() {
        return this.memberModel.countDocuments({ isActive: false });
    }
    async getCount() {
        return this.memberModel.countDocuments();
    }
    async getMemberStatsFromIssues(memberId, token) {
        let totalFinesIssues = 0;
        try {
            const issuesServiceUrl = 'http://library-api-gateway:3000/library/issues';
            const statsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}/stats`, {
                headers: token ? { Authorization: token } : {}
            }));
            const stats = statsResponse.data?.data || { booksAtHome: 0, readingInsideLibrary: 0, totalActive: 0 };
            const allIssuesResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issuesServiceUrl}/issues/member/${memberId}`, {
                headers: token ? { Authorization: token } : {}
            }));
            const allIssues = allIssuesResponse.data?.data || [];
            totalFinesIssues = allIssues.reduce((sum, issue) => sum + (issue.fine || 0), 0);
            let paidFines = 0;
            let unpaidFines = 0;
            let fineHistory = [];
            try {
                const paymentsServiceUrl = 'http://library-api-gateway:3000/library/payments';
                const finesResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${paymentsServiceUrl}/fines/member/${memberId}`, {
                    headers: token ? { Authorization: token } : {}
                }));
                const fines = finesResponse.data?.data || [];
                paidFines = fines
                    .filter((f) => f.status === 'PAID')
                    .reduce((sum, f) => sum + f.amount, 0);
                unpaidFines = fines
                    .filter((f) => f.status === 'UNPAID')
                    .reduce((sum, f) => sum + f.amount, 0);
                fineHistory = fines.map((f) => ({
                    id: f._id,
                    amount: f.amount,
                    reason: f.reason,
                    status: f.status,
                    paidAt: f.paidAt,
                    paymentMethod: f.paymentMethod
                }));
            }
            catch (err) {
                this.logger.error(`Failed to fetch fines from payments service: ${err.message}`);
            }
            const totalFines = totalFinesIssues + unpaidFines;
            const computedStats = {
                booksHeld: stats.totalActive,
                booksAtHome: stats.booksAtHome,
                readingInsideLibrary: stats.readingInsideLibrary,
                totalFines: totalFines,
                paidFines,
                fineHistory
            };
            this.memberModel.findByIdAndUpdate(memberId, {
                ...computedStats,
                hasActiveIssues: computedStats.booksHeld > 0
            }).catch(err => this.logger.error(`Failed to sync stats to DB for member ${memberId}: ${err.message}`));
            return computedStats;
        }
        catch (error) {
            this.logger.error(`Failed to fetch member stats from issues service: ${error.message}`);
            return { booksHeld: 0, booksAtHome: 0, readingInsideLibrary: 0, totalFines: 0, paidFines: 0, fineHistory: [] };
        }
    }
    async getMyStats(userId, token) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is missing');
        }
        const member = await this.memberModel.findById(userId).exec();
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        const borrowingHistory = member.borrowingHistory || [];
        const totalRequests = borrowingHistory.length;
        const memberId = member._id.toString();
        let booksRead = 0;
        try {
            const issueServiceURL = 'http://library-api-gateway:3000/library/issues';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${issueServiceURL}/issues/member/${memberId}/completed-count`, {
                headers: { Authorization: token }
            }));
            booksRead = response.data.count;
        }
        catch (error) {
            booksRead = 0;
        }
        const memberStats = await this.getMemberStatsFromIssues(memberId, token);
        return {
            name: member.name,
            email: member.email,
            memberId,
            phone: member.phoneNumber,
            address: member.address,
            memberSince: member.membershipDate,
            totalRequests,
            booksRead,
            memId: member.memberId,
            paidFines: memberStats.paidFines,
            fineHistory: memberStats.fineHistory,
            totalFines: memberStats.totalFines,
        };
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = MembersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService,
        activity_log_service_1.ActivityLogService,
        redis_emitter_service_1.RedisEmitterService])
], MembersService);
//# sourceMappingURL=members.service.js.map