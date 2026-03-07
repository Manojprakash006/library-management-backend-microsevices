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
exports.ActivityLogSchema = exports.ActivityLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ActivityLog = class ActivityLog {
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Book' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ActivityLog.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Member' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ActivityLog.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ActivityLog.prototype, "timestamp", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ActivityLog);
exports.ActivityLogSchema = mongoose_1.SchemaFactory.createForClass(ActivityLog);
exports.ActivityLogSchema.index({ memberId: 1, timestamp: -1 });
exports.ActivityLogSchema.index({ bookId: 1, timestamp: -1 });
exports.ActivityLogSchema.index({ timestamp: -1 });
//# sourceMappingURL=activity-log.entity.js.map