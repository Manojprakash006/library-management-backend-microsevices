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
exports.LeaveManagementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const leave_request_entity_1 = require("../entities/leave-request.entity");
let LeaveManagementService = class LeaveManagementService {
    constructor(leaveModel) {
        this.leaveModel = leaveModel;
    }
    async applyLeave(dto) {
        const leave = new this.leaveModel({
            ...dto,
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
        });
        return await leave.save();
    }
    async updateStatus(id, dto) {
        const leave = await this.leaveModel.findById(id);
        if (!leave) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (leave.status !== leave_request_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Request already processed');
        }
        leave.status = dto.status;
        leave.approvedBy = new mongoose_2.Types.ObjectId(dto.adminId);
        leave.adminRemarks = dto.adminRemarks;
        return await leave.save();
    }
    async getStaffLeaves(staffId) {
        return await this.leaveModel.find({ staffId: new mongoose_2.Types.ObjectId(staffId) }).sort({ createdAt: -1 }).exec();
    }
    async getAllRequests(status) {
        const query = status ? { status } : {};
        return await this.leaveModel.find(query).populate('staffId', 'fullName staffId').sort({ createdAt: -1 }).exec();
    }
};
exports.LeaveManagementService = LeaveManagementService;
exports.LeaveManagementService = LeaveManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(leave_request_entity_1.LeaveRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeaveManagementService);
//# sourceMappingURL=leave-management.service.js.map