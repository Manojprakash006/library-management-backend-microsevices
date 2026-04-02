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
let LibraryVisitsService = LibraryVisitsService_1 = class LibraryVisitsService {
    constructor(libraryVisitModel) {
        this.libraryVisitModel = libraryVisitModel;
        this.logger = new common_1.Logger(LibraryVisitsService_1.name);
    }
    async checkIn(checkInDto) {
        try {
            const visit = new this.libraryVisitModel({
                memberId: checkInDto.memberId,
                timeIn: new Date(),
                purpose: checkInDto.purpose || 'reading',
                bookId: checkInDto.bookId,
                notes: checkInDto.notes,
                isActive: true,
            });
            const savedVisit = await visit.save();
            this.logger.log(`Member ${checkInDto.memberId} checked in at ${savedVisit.timeIn}`);
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
            return returnVisit;
        }
        catch (error) {
            this.logger.error(`Failed to record return visit: ${error.message}`);
            return null;
        }
    }
};
exports.LibraryVisitsService = LibraryVisitsService;
exports.LibraryVisitsService = LibraryVisitsService = LibraryVisitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(library_visit_entity_1.LibraryVisit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LibraryVisitsService);
//# sourceMappingURL=library-visits.service.js.map