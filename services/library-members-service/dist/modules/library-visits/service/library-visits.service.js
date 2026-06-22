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
var LibraryVisitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryVisitsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const library_visit_entity_1 = require("../entities/library-visit.entity");
const notifications_service_1 = require("../../notifications/service/notifications.service");
let LibraryVisitsService = LibraryVisitsService_1 = class LibraryVisitsService {
    constructor(libraryVisitModel, notificationsService) {
        this.libraryVisitModel = libraryVisitModel;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(LibraryVisitsService_1.name);
    }
    async getMemberDetails(memberIdStr) {
        try {
            const MemberSchema = this.libraryVisitModel.db.model('Member');
            const member = await MemberSchema.findById(memberIdStr).exec();
            if (member) {
                return { name: member.name, memberIdStr: member.memberId || memberIdStr };
            }
        }
        catch (err) {
            this.logger.error(`Failed to fetch member details: ${err.message}`);
        }
        return { name: 'Unknown Member', memberIdStr: memberIdStr };
    }
    async getBookTitle(bookIdStr) {
        try {
            const ProductSchema = this.libraryVisitModel.db.model('Product');
            const book = await ProductSchema.findById(bookIdStr).exec();
            if (book) {
                return book.title || book.name || bookIdStr;
            }
        }
        catch (err) {
            this.logger.error(`Failed to fetch book details: ${err.message}`);
        }
        return bookIdStr;
    }
    async checkIn(checkInDto) {
        try {
            const visit = new this.libraryVisitModel({
                memberId: checkInDto.memberId,
                timeIn: new Date(),
                purpose: checkInDto.purpose || 'reading',
                bookIds: checkInDto.bookId ? [checkInDto.bookId] : [],
                notes: checkInDto.notes,
                isActive: true,
            });
            const savedVisit = await visit.save();
            this.logger.log(`Member ${checkInDto.memberId} checked in at ${savedVisit.timeIn}`);
            const memberDetails = await this.getMemberDetails(checkInDto.memberId.toString());
            await this.notificationsService.notifyStaff({
                title: `${memberDetails.name} Visit In`,
                message: `Member ID: ${memberDetails.memberIdStr} checked in at ${savedVisit.timeIn.toLocaleTimeString()}. Purpose: ${savedVisit.purpose}`,
                type: 'VISITOR_IN'
            });
            return {
                message: 'Check-in successful',
                data: savedVisit,
            };
        }
        catch (error) {
            this.logger.error(`Check-in failed: ${error.message}`);
            throw error;
        }
    }
    async checkOut(checkOutDto) {
        try {
            const visit = await this.libraryVisitModel.findById(checkOutDto.visitId);
            if (!visit) {
                throw new Error('Visit record not found');
            }
            if (!visit.isActive) {
                throw new Error('Already checked out');
            }
            visit.timeOut = new Date();
            visit.isActive = false;
            if (checkOutDto.notes) {
                visit.notes = checkOutDto.notes;
            }
            const updatedVisit = await visit.save();
            this.logger.log(`Member ${visit.memberId} checked out at ${updatedVisit.timeOut}`);
            const memberDetails = await this.getMemberDetails(visit.memberId.toString());
            await this.notificationsService.notifyStaff({
                title: `${memberDetails.name} Visit Out`,
                message: `Member ID: ${memberDetails.memberIdStr} checked out at ${updatedVisit.timeOut.toLocaleTimeString()}.`,
                type: 'VISITOR_OUT'
            });
            return {
                message: 'Check-out successful',
                data: updatedVisit,
            };
        }
        catch (error) {
            this.logger.error(`Check-out failed: ${error.message}`);
            throw error;
        }
    }
    async getTodaysVisits() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const visits = await this.libraryVisitModel
                .find({
                timeIn: { $gte: today },
            })
                .populate('memberId', 'name email memberId')
                .sort({ timeIn: -1 })
                .exec();
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get today's visits: ${error.message}`);
            return [];
        }
    }
    async getActiveVisits() {
        try {
            const visits = await this.libraryVisitModel
                .find({ isActive: true })
                .populate('memberId', 'name email memberId')
                .sort({ timeIn: -1 })
                .exec();
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get active visits: ${error.message}`);
            return [];
        }
    }
    async getMemberVisitHistory(memberId) {
        try {
            const visits = await this.libraryVisitModel
                .find({ memberId })
                .sort({ timeIn: -1 })
                .exec();
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get member visit history: ${error.message}`);
            return [];
        }
    }
    async createVisitForBookIssue(memberId, bookId, purpose = 'issue', timeIn, timeOut) {
        try {
            const existingVisit = await this.libraryVisitModel.findOne({
                memberId: new mongoose_2.Types.ObjectId(memberId),
                isActive: true,
                timeOut: null,
            }).exec();
            if (existingVisit) {
                if (!existingVisit.bookIds.includes(bookId)) {
                    existingVisit.bookIds.push(bookId);
                    await existingVisit.save();
                    this.logger.log(`Added book ${bookId} to existing visit for member ${memberId}`);
                }
                return existingVisit;
            }
            const visit = new this.libraryVisitModel({
                memberId: new mongoose_2.Types.ObjectId(memberId),
                timeIn: timeIn || new Date(),
                timeOut: timeOut || null,
                purpose,
                bookIds: [bookId],
                isActive: !timeOut,
                isAutoRecorded: true,
            });
            const savedVisit = await visit.save();
            this.logger.log(`Auto-created new visit for book issue: Member ${memberId}, Book ${bookId}`);
            const memberDetails = await this.getMemberDetails(memberId.toString());
            const bookTitle = await this.getBookTitle(bookId.toString());
            await this.notificationsService.notifyStaff({
                title: `${memberDetails.name} Visit In`,
                message: `System auto-created a visit for Member ID: ${memberDetails.memberIdStr} due to book issue (Book Name: ${bookTitle}).`,
                type: 'VISITOR_IN'
            });
            return savedVisit;
        }
        catch (error) {
            this.logger.error(`Failed to create visit for book issue: ${error.message}`);
            return null;
        }
    }
    async recordReturnVisit(memberId, bookId) {
        try {
            const activeVisit = await this.libraryVisitModel.findOne({
                memberId: new mongoose_2.Types.ObjectId(memberId),
                bookIds: bookId,
                isActive: true,
                timeOut: null,
            }).exec();
            if (activeVisit) {
                activeVisit.bookIds = activeVisit.bookIds.filter(id => id !== bookId);
                if (activeVisit.bookIds.length === 0) {
                    activeVisit.timeOut = new Date();
                    activeVisit.isActive = false;
                    this.logger.log(`All books returned. Visit completed for member ${memberId}`);
                    const memberDetails = await this.getMemberDetails(memberId.toString());
                    await this.notificationsService.notifyStaff({
                        title: `${memberDetails.name} Visit Out`,
                        message: `System auto-completed visit for Member ID: ${memberDetails.memberIdStr} as all books were returned.`,
                        type: 'VISITOR_OUT'
                    });
                }
                else {
                    this.logger.log(`Book ${bookId} removed. Member ${memberId} still has ${activeVisit.bookIds.length} book(s)`);
                }
                await activeVisit.save();
                return activeVisit;
            }
            const returnVisit = new this.libraryVisitModel({
                memberId: new mongoose_2.Types.ObjectId(memberId),
                bookIds: [bookId],
                timeIn: new Date(),
                timeOut: new Date(),
                purpose: 'return',
                isActive: false,
                isAutoRecorded: true,
            });
            await returnVisit.save();
            this.logger.log(`Created return visit: Member ${memberId}, Book ${bookId}`);
            const memberDetails = await this.getMemberDetails(memberId.toString());
            const bookTitle = await this.getBookTitle(bookId.toString());
            await this.notificationsService.notifyStaff({
                title: `${memberDetails.name} Visit Out`,
                message: `System auto-created a return log for Member ID: ${memberDetails.memberIdStr} (Book Name: ${bookTitle}).`,
                type: 'VISITOR_OUT'
            });
            return returnVisit;
        }
        catch (error) {
            this.logger.error(`Failed to record return visit: ${error.message}`);
            return null;
        }
    }
    async getVisitStats() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const count = await this.libraryVisitModel.countDocuments({
                timeIn: { $gte: today },
            }).exec();
            return count;
        }
        catch (error) {
            this.logger.error(`Failed to get visit stats: ${error.message}`);
            return 0;
        }
    }
    async getVisitsByDate(dateStr) {
        try {
            let query = {};
            if (dateStr) {
                const start = new Date(dateStr);
                start.setHours(0, 0, 0, 0);
                const end = new Date(dateStr);
                end.setHours(23, 59, 59, 999);
                query = {
                    timeIn: { $gte: start, $lte: end }
                };
            }
            const visits = await this.libraryVisitModel
                .find(query)
                .populate('memberId', 'name email memberId')
                .sort({ timeIn: -1 })
                .exec();
            return visits;
        }
        catch (error) {
            this.logger.error(`Failed to get visits by date: ${error.message}`);
            return [];
        }
    }
};
exports.LibraryVisitsService = LibraryVisitsService;
exports.LibraryVisitsService = LibraryVisitsService = LibraryVisitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(library_visit_entity_1.LibraryVisit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService])
], LibraryVisitsService);
//# sourceMappingURL=library-visits.service.js.map