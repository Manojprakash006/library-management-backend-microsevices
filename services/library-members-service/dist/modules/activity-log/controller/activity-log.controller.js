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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_log_service_1 = require("../service/activity-log.service");
const create_activity_log_dto_1 = require("../dto/create-activity-log.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let ActivityLogController = class ActivityLogController {
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async createLog(createActivityLogDto, res) {
        const log = await this.activityLogService.logAction(createActivityLogDto);
        if (!log) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to create activity log'
            });
        }
        return res.status(common_1.HttpStatus.CREATED).json({
            message: 'Activity log created successfully',
            data: log,
        });
    }
    async getLogs(page = 1, limit = 20, adminId, action, entityType, res) {
        const filters = {};
        if (adminId)
            filters.adminId = adminId;
        if (action)
            filters.action = action;
        if (entityType)
            filters.entityType = entityType;
        const result = await this.activityLogService.getLogs(Number(page), Number(limit), filters);
        if (res) {
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Activity logs retrieved successfully',
                data: result.data,
                count: result.count,
                page: Number(page),
                limit: Number(limit)
            });
        }
        return result;
    }
    async getRecentLogs(limit = 10, res) {
        const logs = await this.activityLogService.getRecentLogs(Number(limit));
        if (res) {
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Recent activity logs retrieved successfully',
                data: logs,
                count: logs.length
            });
        }
        return logs;
    }
};
exports.ActivityLogController = ActivityLogController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an activity log internally or from other services' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Activity log created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_log_dto_1.CreateActivityLogDto, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "createLog", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated activity logs with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'adminId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false, type: String }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('adminId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('entityType')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top recent activity logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent logs retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getRecentLogs", null);
exports.ActivityLogController = ActivityLogController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiTags)('Activity Logs'),
    (0, common_1.Controller)('activities'),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map