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
exports.LibraryConfigSchema = exports.LibraryConfig = exports.holidays = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var holidays;
(function (holidays) {
    holidays["publicLeave"] = "Closed on public holidays";
    holidays["maintenanceLeave"] = "Closed for Maintenance";
    holidays["localHoliday"] = "Closed on Local holidays";
    holidays["festivalHoliday"] = "Closed on Festival holidays";
})(holidays || (exports.holidays = holidays = {}));
let LibraryConfig = class LibraryConfig {
};
exports.LibraryConfig = LibraryConfig;
__decorate([
    (0, mongoose_1.Prop)({ default: 'City Central Library' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "libraryName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '123 Library Street, City Center, State - 600001, India' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '+91-44-1234-5678' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '+91-44-1234-5679' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "referencePhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'info@citycentrallibrary.org' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'membership@citycentrallibrary.org' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "membershipEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '09:00' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekdaysOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '20:00' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekdaysClose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '10:00' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekendOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '17:00' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekendClose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Monday - Friday' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekdaysLabel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Saturday - Sunday' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "weekendLabel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: holidays, default: holidays.publicLeave, }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "holidaysInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], LibraryConfig.prototype, "holidayFromDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], LibraryConfig.prototype, "holidayToDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LibraryConfig.prototype, "isHolidayActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "googleMapsEmbed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Your privacy is important to us. We collect only necessary information to provide library services.' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "privacyPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'By using our library services, you agree to follow our rules and regulations regarding book borrowing and facility usage.' }),
    __metadata("design:type", String)
], LibraryConfig.prototype, "termsOfService", void 0);
exports.LibraryConfig = LibraryConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LibraryConfig);
exports.LibraryConfigSchema = mongoose_1.SchemaFactory.createForClass(LibraryConfig);
//# sourceMappingURL=library-config.entity.js.map