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
const staff_entity_1 = require("../../staff/entities/staff.entity");
const member_entity_1 = require("../../members/entities/member.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const mongoose_3 = require("mongoose");
let ActivityLogService = ActivityLogService_1 = class ActivityLogService {
    constructor(activityLogModel, staffModel, memberModel, userModel) {
        this.activityLogModel = activityLogModel;
        this.staffModel = staffModel;
        this.memberModel = memberModel;
        this.userModel = userModel;
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
        const resolvedData = await Promise.all(data.map(async (log) => {
            const logObj = log.toObject();
            if ((0, mongoose_3.isValidObjectId)(log.adminId)) {
                const staff = await this.staffModel.findById(log.adminId).exec();
                if (staff) {
                    logObj['adminName'] = staff.fullName;
                }
                else {
                    const user = await this.userModel.findById(log.adminId).exec();
                    logObj['adminName'] = user ? user.name : 'Unknown Admin';
                }
            }
            else {
                logObj['adminName'] = log.adminId;
            }
            if (log.entityType === 'MEMBER') {
                const query = (0, mongoose_3.isValidObjectId)(log.entityId)
                    ? { _id: log.entityId }
                    : { memberId: log.entityId };
                const member = await this.memberModel.findOne(query).exec();
                logObj['entityName'] = member ? member.name : (log.details?.name || log.entityId);
            }
            else if (log.entityType === 'STAFF') {
                const query = (0, mongoose_3.isValidObjectId)(log.entityId)
                    ? { _id: log.entityId }
                    : { staffId: log.entityId };
                const staff = await this.staffModel.findOne(query).exec();
                logObj['entityName'] = staff ? staff.fullName : (log.details?.fullName || log.details?.name || log.entityId);
            }
            else if (log.entityType === 'BOOK') {
                logObj['entityName'] = log.details?.title || log.details?.name || log.entityId;
            }
            else if (log.entityType === 'ISSUE') {
                logObj['entityName'] = log.details?.bookTitle ? `ISSUE: ${log.details.bookTitle}` : (log.details?.bookId ? `ISSUE: ${log.details.bookId}` : log.entityId);
            }
            else {
                logObj['entityName'] = log.details?.name || log.details?.fullName || log.details?.title || log.entityId;
            }
            return logObj;
        }));
        return { data: resolvedData, count };
    }
    async getRecentLogs(limit = 10) {
        const logs = await this.activityLogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        return Promise.all(logs.map(async (log) => {
            const logObj = log.toObject();
            if ((0, mongoose_3.isValidObjectId)(log.adminId)) {
                const admin = await this.staffModel.findById(log.adminId).exec();
                logObj['adminName'] = admin ? admin.fullName : 'Unknown Admin';
            }
            else {
                logObj['adminName'] = log.adminId;
            }
            if (log.entityType === 'MEMBER') {
                const query = (0, mongoose_3.isValidObjectId)(log.entityId)
                    ? { _id: log.entityId }
                    : { memberId: log.entityId };
                const member = await this.memberModel.findOne(query).exec();
                logObj['entityName'] = member ? member.name : (log.details?.name || log.entityId);
            }
            else if (log.entityType === 'STAFF') {
                const query = (0, mongoose_3.isValidObjectId)(log.entityId)
                    ? { _id: log.entityId }
                    : { staffId: log.entityId };
                const staff = await this.staffModel.findOne(query).exec();
                logObj['entityName'] = staff ? staff.fullName : (log.details?.fullName || log.details?.name || log.entityId);
            }
            else if (log.entityType === 'BOOK') {
                logObj['entityName'] = log.details?.title || log.details?.name || log.entityId;
            }
            else {
                logObj['entityName'] = log.details?.name || log.details?.fullName || log.details?.title || log.entityId;
            }
            return logObj;
        }));
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = ActivityLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_log_entity_1.ActivityLog.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_entity_1.Staff.name)),
    __param(2, (0, mongoose_1.InjectModel)(member_entity_1.Member.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map