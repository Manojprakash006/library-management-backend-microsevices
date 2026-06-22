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
exports.UpdateLeaveStatusDto = exports.CreateLeaveRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const leave_request_entity_1 = require("../entities/leave-request.entity");
class CreateLeaveRequestDto {
}
exports.CreateLeaveRequestDto = CreateLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the staff applying for leave' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of leave', enum: leave_request_entity_1.LeaveType }),
    (0, class_validator_1.IsEnum)(leave_request_entity_1.LeaveType),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "leaveType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date of leave' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date of leave' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for leave' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hours for permission', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateLeaveRequestDto.prototype, "permissionHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time for permission', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "permissionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'From time for permission', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "fromTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'To time for permission', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "toTime", void 0);
class UpdateLeaveStatusDto {
}
exports.UpdateLeaveStatusDto = UpdateLeaveStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New status of the leave request', enum: ['APPROVED', 'REJECTED'] }),
    (0, class_validator_1.IsEnum)(['APPROVED', 'REJECTED']),
    __metadata("design:type", String)
], UpdateLeaveStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the admin approving/rejecting' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateLeaveStatusDto.prototype, "adminId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remarks from admin', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLeaveStatusDto.prototype, "adminRemarks", void 0);
//# sourceMappingURL=leave-request.dto.js.map