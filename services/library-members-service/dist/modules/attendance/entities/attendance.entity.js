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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceSchema = exports.Attendance = exports.AttendanceStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "Present";
    AttendanceStatus["ABSENT"] = "Absent";
    AttendanceStatus["HALF_DAY"] = "Half-day";
    AttendanceStatus["ON_LEAVE"] = "On Leave";
    AttendanceStatus["LATE"] = "Late";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
let Attendance = class Attendance {
};
exports.Attendance = Attendance;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Attendance.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: AttendanceStatus, default: AttendanceStatus.PRESENT }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Attendance.prototype, "checkInTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                breakType: { type: String, enum: ['Tea', 'Lunch', 'Other'], default: 'Tea' },
                startTime: { type: Date },
                endTime: { type: Date }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], Attendance.prototype, "breaks", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOutTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Attendance.prototype, "remarks", void 0);
exports.Attendance = Attendance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Attendance);
exports.AttendanceSchema = mongoose_1.SchemaFactory.createForClass(Attendance);
exports.AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
//# sourceMappingURL=attendance.entity.js.map