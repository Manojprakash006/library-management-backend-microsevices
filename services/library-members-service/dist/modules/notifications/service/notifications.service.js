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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(createNotificationDto) {
        const { memberId, issueId, type, title, message } = createNotificationDto;
        const createdNotification = new this.notificationModel({
            memberId: new mongoose_2.Types.ObjectId(memberId),
            issueId: issueId ? new mongoose_2.Types.ObjectId(issueId) : undefined,
            type,
            title,
            message,
            isRead: false,
            sentAt: new Date(),
        });
        return createdNotification.save();
    }
    async findAll() {
        return this.notificationModel.find().exec();
    }
    async findByMember(memberId) {
        return this.notificationModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId) })
            .populate('issueId', 'bookId dueDate')
            .sort('-createdAt')
            .limit(50)
            .exec();
    }
    async findUnreadByMember(memberId) {
        return this.notificationModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId), isRead: false })
            .populate('issueId', 'bookId dueDate')
            .sort('-createdAt')
            .exec();
    }
    async findOne(id) {
        const notification = await this.notificationModel
            .findById(id)
            .populate('issueId', 'bookId dueDate')
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAsRead(id, memberId) {
        const notification = await this.notificationModel
            .findOneAndUpdate({ _id: id, memberId: new mongoose_2.Types.ObjectId(memberId) }, { isRead: true }, { new: true })
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAllAsRead(memberId) {
        await this.notificationModel
            .updateMany({ memberId: new mongoose_2.Types.ObjectId(memberId), isRead: false }, { isRead: true })
            .exec();
    }
    async remove(id) {
        const result = await this.notificationModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Notification not found');
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_entity_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map