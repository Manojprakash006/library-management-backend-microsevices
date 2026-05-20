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
exports.SystemConfigSchema = exports.SystemConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SystemConfig = class SystemConfig {
};
exports.SystemConfig = SystemConfig;
__decorate([
    (0, mongoose_1.Prop)({ default: 'DEFAULT' }),
    __metadata("design:type", String)
], SystemConfig.prototype, "configKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '09:00 AM' }),
    __metadata("design:type", String)
], SystemConfig.prototype, "shiftStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '06:00 PM' }),
    __metadata("design:type", String)
], SystemConfig.prototype, "shiftEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15 }),
    __metadata("design:type", Number)
], SystemConfig.prototype, "gracePeriod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SystemConfig.prototype, "autoAbsentEnabled", void 0);
exports.SystemConfig = SystemConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SystemConfig);
exports.SystemConfigSchema = mongoose_1.SchemaFactory.createForClass(SystemConfig);
//# sourceMappingURL=system-config.entity.js.map