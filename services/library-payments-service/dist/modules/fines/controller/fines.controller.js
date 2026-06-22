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
const create_fine_dto_1 = require("../dto/create-fine.dto");
const verify_payment_dto_1 = require("../dto/verify-payment.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let FinesController = class FinesController {
    constructor(finesService) {
        this.finesService = finesService;
    }
    async getAllFines(page = '1', limit = '10') {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const result = await this.finesService.getAllFines(pageNum, limitNum);
        return {
            message: 'All fines retrieved successfully',
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
    async getFinesByMemberId(memberId) {
        const data = await this.finesService.getFinesByMemberId(memberId);
        return { message: 'Fines retrieved successfully', data };
    }
    async getFineById(id) {
        const data = await this.finesService.getFineById(id);
        return { message: 'Fine retrieved successfully', data };
    }
    async checkPendingFines(memberId) {
        const data = await this.finesService.checkPendingFines(memberId);
        return { message: 'Pending fines retrieved successfully', data };
    }
    async createFine(createFineDto) {
        const data = await this.finesService.createFine(createFineDto);
        return { message: 'Fine created successfully', data };
    }
    async payFine(id, payFineDto) {
        const data = await this.finesService.payFine(id, payFineDto.paymentMethod, payFineDto.referenceId);
        return { message: 'Fine paid successfully', data };
    }
    async createRazorpayOrder(id) {
        const data = await this.finesService.createRazorpayOrder(id);
        return { message: 'Razorpay order created successfully', data };
    }
    async verifyRazorpayPayment(verifyPaymentDto) {
        const data = await this.finesService.verifyRazorpayPayment(verifyPaymentDto.fineId, verifyPaymentDto.razorpayOrderId, verifyPaymentDto.razorpayPaymentId, verifyPaymentDto.signature);
        return { message: 'Payment verified successfully', data };
    }
    async updateFine(id, data) {
        return this.finesService.updateFine(id, data);
    }
    async deleteFine(id) {
        return this.finesService.deleteFine(id);
    }
    async getInvoice(id) {
        return this.finesService.getInvoiceHtml(id);
    }
    async downloadInvoicePdf(id, res) {
        const buffer = await this.finesService.getInvoicePdf(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Invoice_${id}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async getReportsData(startDate, endDate) {
        if (!startDate || !endDate) {
            const today = new Date().toISOString();
            return this.finesService.getReportsData(today, today);
        }
        return this.finesService.getReportsData(startDate, endDate);
    }
    async getPaymentsReport() {
        return this.finesService.getPaymentsReport();
    }
};
exports.FinesController = FinesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fines' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Return all fines.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getAllFines", null);
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
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
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
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
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('member/:memberId/pending-check'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
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
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fine' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Fine successfully created.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fine_dto_1.CreateFineDto]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "createFine", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
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
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
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
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay payment signature' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Payment verified and fine updated.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "verifyRazorpayPayment", null);
__decorate([
    (0, common_1.Post)(':id/update'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a fine (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "updateFine", null);
__decorate([
    (0, common_1.Post)(':id/delete'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a fine (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "deleteFine", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/invoice'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice HTML for a fine' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getInvoice", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Download invoice PDF' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "downloadInvoicePdf", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('reports/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report overview data' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getReportsData", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('reports/payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payments report data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinesController.prototype, "getPaymentsReport", null);
exports.FinesController = FinesController = __decorate([
    (0, swagger_1.ApiTags)('fines'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('fines'),
    __metadata("design:paramtypes", [fines_service_1.FinesService])
], FinesController);
//# sourceMappingURL=fines.controller.js.map