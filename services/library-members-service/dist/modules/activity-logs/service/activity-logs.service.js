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
var ActivityLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityLogsService = ActivityLogsService_1 = class ActivityLogsService {
    constructor(activityLogModel) {
        this.activityLogModel = activityLogModel;
        this.logger = new common_1.Logger(ActivityLogsService_1.name);
    }
    async create(createActivityLogDto) {
        const { action, bookId, memberId, userId, description, performedBy } = createActivityLogDto;
        const createdLog = new this.activityLogModel({
            action,
            bookId: bookId ? new mongoose_2.Types.ObjectId(bookId) : undefined,
            memberId: memberId ? new mongoose_2.Types.ObjectId(memberId) : undefined,
            userId: userId ? new mongoose_2.Types.ObjectId(userId) : undefined,
            description,
            performedBy,
            timestamp: new Date(),
        });
        return createdLog.save();
    }
    async findAll(limit = 50) {
        return this.activityLogModel
            .find()
            .populate('bookId', 'bookId title')
            .populate('memberId', 'fullName')
            .populate('userId', 'name')
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();
    }
    async findByMember(memberId, limit = 50) {
        return this.activityLogModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId) })
            .populate('bookId', 'bookId title')
            .populate('memberId', 'fullName')
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();
    }
    async findByBook(bookId, limit = 50) {
        return this.activityLogModel
            .find({ bookId: new mongoose_2.Types.ObjectId(bookId) })
            .populate('bookId', 'bookId title')
            .populate('memberId', 'fullName')
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();
    }
    async findOne(id) {
        const log = await this.activityLogModel
            .findById(id)
            .populate('bookId', 'bookId title')
            .populate('memberId', 'fullName')
            .populate('userId', 'name')
            .exec();
        if (!log) {
            throw new common_1.NotFoundException('Activity log not found');
        }
        return log;
    }
    async remove(id) {
        const result = await this.activityLogModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Activity log not found');
        }
    }
};
exports.ActivityLogsService = ActivityLogsService;
exports.ActivityLogsService = ActivityLogsService = ActivityLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_log_entity_1.ActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActivityLogsService);
//# sourceMappingURL=activity-logs.service.js.map