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
const crypto = require("crypto");
const Razorpay = require('razorpay');
const fine_entity_1 = require("../entities/fine.entity");
let FinesService = class FinesService {
    constructor(fineModel) {
        this.fineModel = fineModel;
        this.razorpayInstance = new Razorpay({
            key_id: process.env.RZP_KEY_ID || 'rzp_test_SaDCl7Au48PRQf',
            key_secret: process.env.RZP_KEY_SECRET || 'Ge4uiF1mxjvZZ5LSXgy5PAZt',
        });
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
    async createRazorpayOrder(fineId) {
        const fine = await this.getFineById(fineId);
        if (fine.status === fine_entity_1.FineStatus.PAID) {
            throw new common_1.BadRequestException(`Fine with ID ${fineId} is already paid`);
        }
        const options = {
            amount: Math.round(fine.amount * 100),
            currency: 'INR',
            receipt: `receipt_fine_${fineId}`,
        };
        try {
            const order = await this.razorpayInstance.orders.create(options);
            fine.razorpayOrderId = order.id;
            await fine.save();
            return {
                orderId: order.id,
                amount: options.amount,
                currency: options.currency,
                fineId,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Could not create Razorpay order');
        }
    }
    async verifyRazorpayPayment(fineId, razorpayOrderId, razorpayPaymentId, signature) {
        const fine = await this.getFineById(fineId);
        if (fine.status === fine_entity_1.FineStatus.PAID) {
            return fine;
        }
        if (fine.razorpayOrderId !== razorpayOrderId) {
            throw new common_1.BadRequestException('Order ID mismatch');
        }
        const secret = process.env.RZP_KEY_SECRET || 'Ge4uiF1mxjvZZ5LSXgy5PAZt';
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');
        if (generatedSignature !== signature) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        fine.status = fine_entity_1.FineStatus.PAID;
        fine.paymentMethod = fine_entity_1.PaymentMethod.UPI;
        fine.referenceId = razorpayPaymentId;
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