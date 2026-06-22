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
exports.NotificationSchema = exports.Notification = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["DUE_REMINDER"] = "DUE_REMINDER";
    NotificationType["OVERDUE"] = "OVERDUE";
    NotificationType["RETURN_CONFIRMATION"] = "RETURN_CONFIRMATION";
    NotificationType["REQUEST_APPROVED"] = "REQUEST_APPROVED";
    NotificationType["REQUEST_REJECTED"] = "REQUEST_REJECTED";
    NotificationType["NEW_BOOK_REQUEST"] = "NEW_BOOK_REQUEST";
    NotificationType["NEW_BOOK_ADDED"] = "NEW_BOOK_ADDED";
    NotificationType["BOOK_ISSUED"] = "BOOK_ISSUED";
    NotificationType["BOOK_RETURNED"] = "BOOK_RETURNED";
    NotificationType["VISITOR_IN"] = "VISITOR_IN";
    NotificationType["VISITOR_OUT"] = "VISITOR_OUT";
    NotificationType["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    NotificationType["FINE_ADDED"] = "FINE_ADDED";
    NotificationType["CONTACT_MESSAGE"] = "CONTACT_MESSAGE";
    NotificationType["GENERAL"] = "GENERAL";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Notification.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'IssueBook' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Notification.prototype, "issueId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: NotificationType,
        required: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Notification.prototype, "sentAt", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ memberId: 1, isRead: 1 });
exports.NotificationSchema.index({ memberId: 1, sentAt: -1 });
exports.NotificationSchema.index({ type: 1 });
exports.NotificationSchema.virtual('read').get(function () {
    return this.isRead;
});
exports.NotificationSchema.set('toJSON', { virtuals: true });
exports.NotificationSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=notification.entity.js.map