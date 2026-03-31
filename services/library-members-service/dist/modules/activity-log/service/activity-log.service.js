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
var ActivityLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityLogService = ActivityLogService_1 = class ActivityLogService {
    constructor(activityLogModel) {
        this.activityLogModel = activityLogModel;
        this.logger = new common_1.Logger(ActivityLogService_1.name);
    }
    async logAction(createDto) {
        try {
            const newLog = new this.activityLogModel(createDto);
            return await newLog.save();
        }
        catch (error) {
            this.logger.error(`Failed to create activity log: ${error.message}`, error.stack);
            return null;
        }
    }
    async getLogs(page = 1, limit = 20, filters = {}) {
        const skip = (page - 1) * limit;
        const [data, count] = await Promise.all([
            this.activityLogModel
                .find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.activityLogModel.countDocuments(filters).exec(),
        ]);
        return { data, count };
    }
    async getRecentLogs(limit = 10) {
        return this.activityLogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = ActivityLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_log_entity_1.ActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map