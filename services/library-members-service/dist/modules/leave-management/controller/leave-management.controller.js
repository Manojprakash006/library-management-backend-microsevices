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
exports.LeaveManagementController = void 0;
const common_1 = require("@nestjs/common");
const leave_management_service_1 = require("../service/leave-management.service");
const leave_request_dto_1 = require("../dto/leave-request.dto");
const swagger_1 = require("@nestjs/swagger");
let LeaveManagementController = class LeaveManagementController {
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async applyLeave(dto) {
        return await this.leaveService.applyLeave(dto);
    }
    async updateStatus(id, dto) {
        return await this.leaveService.updateStatus(id, dto);
    }
    async getStaffLeaves(staffId) {
        return await this.leaveService.getStaffLeaves(staffId);
    }
    async getAllRequests(status) {
        return await this.leaveService.getAllRequests(status);
    }
};
exports.LeaveManagementController = LeaveManagementController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for leave' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_request_dto_1.CreateLeaveRequestDto]),
    __metadata("design:returntype", Promise)
], LeaveManagementController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Patch)('status/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update leave request status (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, leave_request_dto_1.UpdateLeaveStatusDto]),
    __metadata("design:returntype", Promise)
], LeaveManagementController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave history for a staff' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveManagementController.prototype, "getStaffLeaves", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all leave requests' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveManagementController.prototype, "getAllRequests", null);
exports.LeaveManagementController = LeaveManagementController = __decorate([
    (0, swagger_1.ApiTags)('Leave Management'),
    (0, common_1.Controller)('leave-management'),
    __metadata("design:paramtypes", [leave_management_service_1.LeaveManagementService])
], LeaveManagementController);
//# sourceMappingURL=leave-management.controller.js.map