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
exports.FinesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fines_service_1 = require("../service/fines.service");
const pay_fine_dto_1 = require("../dto/pay-fine.dto");
const verify_payment_dto_1 = require("../dto/verify-payment.dto");
let FinesController = class FinesController {
    constructor(finesService) {
        this.finesService = finesService;
    }
    async getFinesByMemberId(memberId) {
        return this.finesService.getFinesByMemberId(memberId);
    }
    async getFineById(id) {
        return this.finesService.getFineById(id);
    }
    async checkPendingFines(memberId) {
        return this.finesService.checkPendingFines(memberId);
    }
    async createFine(createFineDto) {
        return this.finesService.createFine(createFineDto);
    }
    async payFine(id, payFineDto) {
        return this.finesService.payFine(id, payFineDto.paymentMethod, payFineDto.referenceId);
    }
    async createRazorpayOrder(id) {
        return this.finesService.createRazorpayOrder(id);
    }
    async verifyRazorpayPayment(verifyPaymentDto) {
        return this.finesService.verifyRazorpayPayment(verifyPaymentDto.fineId, verifyPaymentDto.razorpayOrderId, verifyPaymentDto.razorpayPaymentId, verifyPaymentDto.signature);
    }
};
exports.FinesController = FinesController;
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fines for a member' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Return all fines for the member.' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getFinesByMemberId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a fine by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Return the fine.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Fine not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getFineById", null);
__decorate([
    (0, common_1.Get)('member/:memberId/pending-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check pending fines for a member' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Return pending fines status.' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "checkPendingFines", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fine' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Fine successfully created.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "createFine", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Pay a fine' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Fine successfully paid.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pay_fine_dto_1.PayFineDto]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "payFine", null);
__decorate([
    (0, common_1.Post)(':id/create-razorpay-order'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Razorpay order for a fine' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Razorpay order created.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "createRazorpayOrder", null);
__decorate([
    (0, common_1.Post)('verify-razorpay-payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay payment signature' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Payment verified and fine updated.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "verifyRazorpayPayment", null);
exports.FinesController = FinesController = __decorate([
    (0, swagger_1.ApiTags)('fines'),
    (0, common_1.Controller)('fines'),
    __metadata("design:paramtypes", [fines_service_1.FinesService])
], FinesController);
//# sourceMappingURL=fines.controller.js.map