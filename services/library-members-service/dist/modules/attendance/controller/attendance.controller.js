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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("../service/attendance.service");
const create_attendance_dto_1 = require("../dto/create-attendance.dto");
const swagger_1 = require("@nestjs/swagger");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async markAttendance(dto) {
        return await this.attendanceService.markAttendance(dto);
    }
    async checkIn(staffId) {
        return await this.attendanceService.checkIn(staffId);
    }
    async checkOut(staffId) {
        return await this.attendanceService.checkOut(staffId);
    }
    async breakStart(staffId, type) {
        return await this.attendanceService.breakStart(staffId, type);
    }
    async breakEnd(staffId) {
        return await this.attendanceService.breakEnd(staffId);
    }
    async getStaffAttendance(staffId) {
        return await this.attendanceService.getStaffAttendance(staffId);
    }
    async getAllAttendance(date) {
        return await this.attendanceService.getAllAttendance(date);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('mark'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark attendance (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Post)('check-in/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff check-in' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff check-out' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Post)('break-start/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff break start' }),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "breakStart", null);
__decorate([
    (0, common_1.Post)('break-end/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff break end' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "breakEnd", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance history for a staff' }),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStaffAttendance", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendance records' }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAllAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map