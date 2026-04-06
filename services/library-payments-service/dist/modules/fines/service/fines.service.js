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
exports.FinesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fine_entity_1 = require("../entities/fine.entity");
let FinesService = class FinesService {
    constructor(fineModel) {
        this.fineModel = fineModel;
    }
    async createFine(data) {
        const newFine = new this.fineModel({
            ...data,
            status: fine_entity_1.FineStatus.UNPAID,
        });
        return newFine.save();
    }
    async checkPendingFines(memberId) {
        const pendingFines = await this.fineModel.find({ memberId, status: fine_entity_1.FineStatus.UNPAID }).exec();
        const totalAmount = pendingFines.reduce((sum, fine) => sum + fine.amount, 0);
        return {
            hasPendingFines: pendingFines.length > 0,
            totalPendingAmount: totalAmount,
            pendingFines,
        };
    }
    async getFineById(id) {
        const fine = await this.fineModel.findById(id).exec();
        if (!fine) {
            throw new common_1.NotFoundException(`Fine with ID ${id} not found`);
        }
        return fine;
    }
    async getFinesByMemberId(memberId) {
        return this.fineModel.find({ memberId }).exec();
    }
    async payFine(id, paymentMethod, referenceId) {
        const fine = await this.fineModel.findById(id).exec();
        if (!fine) {
            throw new common_1.NotFoundException(`Fine with ID ${id} not found`);
        }
        if (fine.status === fine_entity_1.FineStatus.PAID) {
            return fine;
        }
        fine.status = fine_entity_1.FineStatus.PAID;
        fine.paymentMethod = paymentMethod;
        fine.referenceId = referenceId;
        fine.paidAt = new Date();
        return fine.save();
    }
};
exports.FinesService = FinesService;
exports.FinesService = FinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fine_entity_1.Fine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FinesService);
//# sourceMappingURL=fines.service.js.map