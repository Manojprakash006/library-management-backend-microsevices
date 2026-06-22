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
exports.LeaveRequestSchema = exports.LeaveRequest = exports.LeaveStatus = exports.LeaveType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var LeaveType;
(function (LeaveType) {
    LeaveType["SICK_LEAVE"] = "Sick Leave";
    LeaveType["CASUAL_LEAVE"] = "Casual Leave";
    LeaveType["PERSONAL_PERMISSION"] = "Personal Permission";
    LeaveType["EMERGENCY"] = "Emergency";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "PENDING";
    LeaveStatus["APPROVED"] = "APPROVED";
    LeaveStatus["REJECTED"] = "REJECTED";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
let LeaveRequest = class LeaveRequest {
};
exports.LeaveRequest = LeaveRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveRequest.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: LeaveType, required: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "leaveType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LeaveRequest.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], LeaveRequest.prototype, "permissionHours", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeaveRequest.prototype, "permissionTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeaveRequest.prototype, "fromTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeaveRequest.prototype, "toTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: LeaveStatus, default: LeaveStatus.PENDING, index: true }),
    __metadata("design:type", String)
], LeaveRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LeaveRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LeaveRequest.prototype, "adminRemarks", void 0);
exports.LeaveRequest = LeaveRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LeaveRequest);
exports.LeaveRequestSchema = mongoose_1.SchemaFactory.createForClass(LeaveRequest);
//# sourceMappingURL=leave-request.entity.js.map