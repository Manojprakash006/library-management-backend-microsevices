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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_entity_1 = require("../entities/attendance.entity");
const system_config_service_1 = require("../../system-config/service/system-config.service");
const staff_service_1 = require("../../staff/service/staff.service");
const schedule_1 = require("@nestjs/schedule");
let AttendanceService = class AttendanceService {
    constructor(attendanceModel, configService, staffService) {
        this.attendanceModel = attendanceModel;
        this.configService = configService;
        this.staffService = staffService;
    }
    async markAttendance(dto) {
        const existing = await this.attendanceModel.findOne({ staffId: dto.staffId, date: dto.date });
        if (existing) {
            throw new common_1.ConflictException('Attendance already marked for this date');
        }
        const attendance = new this.attendanceModel(dto);
        return await attendance.save();
    }
    async checkIn(staffId) {
        const today = new Date().toISOString().split('T')[0];
        let attendance = await this.attendanceModel.findOne({ staffId, date: today });
        if (attendance) {
            throw new common_1.ConflictException('Already checked in today');
        }
        const [staff, config] = await Promise.all([
            this.staffService.findById(staffId),
            this.configService.getConfig(),
        ]);
        const shift = staff.shift;
        const now = new Date();
        let status = attendance_entity_1.AttendanceStatus.PRESENT;
        const startTimeStr = shift?.startTime || config?.shiftStartTime || '09:00 AM';
        const gracePeriodMins = (shift?.gracePeriod !== undefined && shift?.gracePeriod !== null)
            ? shift.gracePeriod
            : (config?.gracePeriod || 15);
        const [time, modifier] = startTimeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12)
            hours += 12;
        if (modifier === 'AM' && hours === 12)
            hours = 0;
        const shiftStart = new Date();
        shiftStart.setHours(hours, minutes, 0, 0);
        const graceTime = new Date(shiftStart.getTime() + gracePeriodMins * 60000);
        if (now > graceTime) {
            status = attendance_entity_1.AttendanceStatus.LATE;
        }
        attendance = new this.attendanceModel({
            staffId,
            date: today,
            status: status,
            checkInTime: now,
        });
        return await attendance.save();
    }
    async checkOut(staffId) {
        const today = new Date().toISOString().split('T')[0];
        const attendance = await this.attendanceModel.findOne({ staffId, date: today });
        if (!attendance) {
            throw new common_1.NotFoundException('No check-in record found for today');
        }
        if (attendance.checkOutTime) {
            throw new common_1.ConflictException('Already checked out today');
        }
        attendance.checkOutTime = new Date();
        return await attendance.save();
    }
    async breakStart(staffId, type = 'Tea') {
        const today = new Date().toISOString().split('T')[0];
        const attendance = await this.attendanceModel.findOne({ staffId, date: today });
        if (!attendance) {
            throw new common_1.NotFoundException('No check-in record found for today');
        }
        const activeBreak = attendance.breaks.find(b => !b.endTime);
        if (activeBreak) {
            throw new common_1.ConflictException('Already on a break');
        }
        const staff = await this.staffService.findById(staffId);
        const maxAllowed = staff.shift?.maxBreaks || 3;
        if (attendance.breaks.length >= maxAllowed) {
            throw new common_1.ConflictException(`Maximum of ${maxAllowed} breaks allowed per shift`);
        }
        attendance.breaks.push({
            breakType: type,
            startTime: new Date(),
            endTime: null
        });
        return await attendance.save();
    }
    async breakEnd(staffId) {
        const today = new Date().toISOString().split('T')[0];
        const attendance = await this.attendanceModel.findOne({ staffId, date: today });
        if (!attendance) {
            throw new common_1.NotFoundException('No check-in record found for today');
        }
        const activeBreakIndex = attendance.breaks.findIndex(b => !b.endTime);
        if (activeBreakIndex === -1) {
            throw new common_1.ConflictException('No active break found');
        }
        attendance.breaks[activeBreakIndex].endTime = new Date();
        attendance.markModified('breaks');
        return await attendance.save();
    }
    async getStaffAttendance(staffId) {
        return await this.attendanceModel.find({ staffId }).sort({ date: -1 }).exec();
    }
    async getAllAttendance(date) {
        const query = date ? { date } : {};
        return await this.attendanceModel.find(query).populate('staffId', 'fullName staffId').sort({ date: -1 }).exec();
    }
    async markAutoAbsent() {
        const config = await this.configService.getConfig();
        if (!config?.autoAbsentEnabled)
            return;
        const today = new Date().toISOString().split('T')[0];
        const allStaff = await this.staffService.findAll(1, 1000);
        for (const staff of allStaff.data) {
            const attendance = await this.attendanceModel.findOne({ staffId: staff._id, date: today });
            if (!attendance) {
                await this.attendanceModel.create({
                    staffId: staff._id,
                    date: today,
                    status: attendance_entity_1.AttendanceStatus.ABSENT,
                });
            }
        }
    }
};
exports.AttendanceService = AttendanceService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_11PM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceService.prototype, "markAutoAbsent", null);
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_entity_1.Attendance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        system_config_service_1.SystemConfigService,
        staff_service_1.StaffService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map