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
var FinesGrpcController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinesGrpcController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const fines_service_1 = require("../service/fines.service");
let FinesGrpcController = FinesGrpcController_1 = class FinesGrpcController {
    constructor(finesService) {
        this.finesService = finesService;
        this.logger = new common_1.Logger(FinesGrpcController_1.name);
    }
    async createFine(data) {
        this.logger.log(`Received gRPC CreateFine request: ${JSON.stringify(data)}`);
        try {
            const fine = await this.finesService.createFine(data);
            return this.mapFineToResponse(fine);
        }
        catch (error) {
            this.logger.error(`Error creating fine: ${error.message}`, error.stack);
            throw error;
        }
    }
    async checkPendingFines(data) {
        this.logger.log(`Received gRPC CheckPendingFines request for member: ${data.memberId}`);
        try {
            const result = await this.finesService.checkPendingFines(data.memberId);
            return {
                hasPendingFines: result.hasPendingFines,
                totalPendingAmount: result.totalPendingAmount,
                pendingFines: result.pendingFines.map(fine => this.mapFineToResponse(fine)),
            };
        }
        catch (error) {
            this.logger.error(`Error checking pending fines: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getFine(data) {
        this.logger.log(`Received gRPC GetFine request for ID: ${data.id}`);
        try {
            const fine = await this.finesService.getFineById(data.id);
            return this.mapFineToResponse(fine);
        }
        catch (error) {
            this.logger.error(`Error fetching fine: ${error.message}`, error.stack);
            throw error;
        }
    }
    mapFineToResponse(fine) {
        return {
            id: fine._id.toString(),
            memberId: fine.memberId,
            issueId: fine.issueId,
            amount: fine.amount,
            reason: fine.reason,
            status: fine.status,
            paymentMethod: fine.paymentMethod || '',
            paidAt: fine.paidAt ? fine.paidAt.toISOString() : '',
            referenceId: fine.referenceId || '',
            createdAt: fine.createdAt ? fine.createdAt.toISOString() : '',
            updatedAt: fine.updatedAt ? fine.updatedAt.toISOString() : '',
        };
    }
};
exports.FinesGrpcController = FinesGrpcController;
__decorate([
    (0, microservices_1.GrpcMethod)('FinesService', 'CreateFine'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinesGrpcController.prototype, "createFine", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FinesService', 'CheckPendingFines'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinesGrpcController.prototype, "checkPendingFines", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FinesService', 'GetFine'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinesGrpcController.prototype, "getFine", null);
exports.FinesGrpcController = FinesGrpcController = FinesGrpcController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fines_service_1.FinesService])
], FinesGrpcController);
//# sourceMappingURL=fines-grpc.controller.js.map