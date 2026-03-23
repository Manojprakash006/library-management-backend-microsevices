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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const staff_entity_1 = require("../entities/staff.entity");
const activity_log_service_1 = require("../../activity-log/service/activity-log.service");
let StaffService = class StaffService {
    constructor(staffModel, jwtService, activityLogService) {
        this.staffModel = staffModel;
        this.jwtService = jwtService;
        this.activityLogService = activityLogService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const staff = await this.staffModel.findOne({ email }).select('+password');
        if (!staff) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({
            userId: staff._id,
            email: staff.email,
            role: staff.role,
        });
        return {
            token,
            user: {
                id: staff._id,
                email: staff.email,
                fullName: staff.fullName,
                role: staff.role,
            },
        };
    }
    async create(createDto, adminId) {
        const existingStaff = await this.staffModel.findOne({ email: createDto.email });
        if (existingStaff) {
            throw new common_1.ConflictException('Email already registered');
        }
        const staff = new this.staffModel(createDto);
        const savedStaff = await staff.save();
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'CREATE',
                entityType: 'STAFF',
                entityId: savedStaff._id.toString(),
                details: { email: savedStaff.email, fullName: savedStaff.fullName }
            });
        }
        return savedStaff;
    }
    async findAll() {
        return this.staffModel.find().select('-password');
    }
    async findById(id) {
        const staff = await this.staffModel.findById(id).select('-password');
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        return staff;
    }
    async update(id, updateDto, adminId) {
        const staff = await this.staffModel.findByIdAndUpdate(id, { $set: updateDto }, { new: true, runValidators: true }).select('-password');
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'UPDATE',
                entityType: 'STAFF',
                entityId: id,
                details: { updatedFields: Object.keys(updateDto) }
            });
        }
        return staff;
    }
    async delete(id, adminId) {
        const staff = await this.staffModel.findByIdAndDelete(id);
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        if (adminId) {
            await this.activityLogService.logAction({
                adminId,
                action: 'DELETE',
                entityType: 'STAFF',
                entityId: id,
                details: { email: staff.email }
            });
        }
        return { message: 'Staff deleted successfully' };
    }
    async getStats() {
        const totalStaff = await this.staffModel.countDocuments();
        const activeStaff = await this.staffModel.countDocuments({ status: 'Active' });
        const inactiveStaff = await this.staffModel.countDocuments({ status: 'Inactive' });
        return {
            totalStaff,
            activeStaff,
            inactiveStaff,
        };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(staff_entity_1.Staff.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        activity_log_service_1.ActivityLogService])
], StaffService);
//# sourceMappingURL=staff.service.js.map