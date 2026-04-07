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
exports.FineSchema = exports.Fine = exports.PaymentMethod = exports.FineStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var FineStatus;
(function (FineStatus) {
    FineStatus["PAID"] = "PAID";
    FineStatus["UNPAID"] = "UNPAID";
})(FineStatus || (exports.FineStatus = FineStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["CARD"] = "CARD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Fine = class Fine {
};
exports.Fine = Fine;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Fine.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Fine.prototype, "issueId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Fine.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Fine.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: FineStatus, default: FineStatus.UNPAID }),
    __metadata("design:type", String)
], Fine.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, enum: PaymentMethod }),
    __metadata("design:type", String)
], Fine.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Fine.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Fine.prototype, "referenceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Fine.prototype, "razorpayOrderId", void 0);
exports.Fine = Fine = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Fine);
exports.FineSchema = mongoose_1.SchemaFactory.createForClass(Fine);
//# sourceMappingURL=fine.entity.js.map