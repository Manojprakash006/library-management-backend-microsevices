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
exports.StaffSchema = exports.Staff = exports.StaffStatus = exports.StaffRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
var StaffRole;
(function (StaffRole) {
    StaffRole["ADMIN"] = "admin";
    StaffRole["STAFF"] = "staff";
})(StaffRole || (exports.StaffRole = StaffRole = {}));
var StaffStatus;
(function (StaffStatus) {
    StaffStatus["ACTIVE"] = "Active";
    StaffStatus["INACTIVE"] = "Inactive";
})(StaffStatus || (exports.StaffStatus = StaffStatus = {}));
let Staff = class Staff {
};
exports.Staff = Staff;
__decorate([
    (0, mongoose_1.Prop)({ unique: true, trim: true, index: true, sparse: true }),
    __metadata("design:type", String)
], Staff.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 2, maxlength: 100, index: true }),
    __metadata("design:type", String)
], Staff.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true, index: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 10, maxlength: 20 }),
    __metadata("design:type", String)
], Staff.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 6, maxlength: 100, select: false }),
    __metadata("design:type", String)
], Staff.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Staff.prototype, "shift", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: StaffStatus, default: StaffStatus.ACTIVE, index: true }),
    __metadata("design:type", String)
], Staff.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: StaffRole, default: StaffRole.STAFF, index: true }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], Staff.prototype, "qualification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], Staff.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, minlength: 10, maxlength: 20 }),
    __metadata("design:type", String)
], Staff.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: 'General' }),
    __metadata("design:type", String)
], Staff.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Staff.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Staff.prototype, "lastActive", void 0);
exports.Staff = Staff = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Staff);
exports.StaffSchema = mongoose_1.SchemaFactory.createForClass(Staff);
exports.StaffSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
exports.StaffSchema.pre('save', async function (next) {
    if (this.staffId)
        return next();
    const count = await this.constructor.countDocuments();
    this.staffId = `STF${count + 1}`;
    next();
});
exports.StaffSchema.index({ email: 1, isActive: 1 });
exports.StaffSchema.index({ department: 1, status: 1 });
//# sourceMappingURL=staff.entity.js.map