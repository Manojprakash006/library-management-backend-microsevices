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
exports.MemberSchema = exports.Member = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let Member = class Member {
};
exports.Member = Member;
__decorate([
    (0, mongoose_1.Prop)({ unique: true, trim: true, index: true, default: () => 'MEM' + crypto.randomUUID().slice(0, 8).toUpperCase() }),
    __metadata("design:type", String)
], Member.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 2, maxlength: 100 }),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true, index: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, minlength: 10, maxlength: 20, default: '' }),
    __metadata("design:type", String)
], Member.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], Member.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 6, maxlength: 100, select: false }),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Member.prototype, "membershipDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Member.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            bookId: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }]),
    __metadata("design:type", Array)
], Member.prototype, "reviews", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            bookId: { type: String, required: true },
            bookTitle: { type: String },
            borrowedAt: { type: Date, default: Date.now },
            returnedAt: { type: Date },
            status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
        }]),
    __metadata("design:type", Array)
], Member.prototype, "borrowingHistory", void 0);
exports.Member = Member = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Member);
exports.MemberSchema = mongoose_1.SchemaFactory.createForClass(Member);
exports.MemberSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
exports.MemberSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};
exports.MemberSchema.index({ email: 1, isActive: 1 });
//# sourceMappingURL=member.entity.js.map