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
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_logs_service_1 = require("../service/activity-logs.service");
const create_activity_log_dto_1 = require("../dto/create-activity-log.dto");
const activity_log_entity_1 = require("../entities/activity-log.entity");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let ActivityLogsController = class ActivityLogsController {
    constructor(activityLogsService) {
        this.activityLogsService = activityLogsService;
    }
    async create(createActivityLogDto) {
        const log = await this.activityLogsService.create(createActivityLogDto);
        return { message: 'Activity log created successfully', data: log };
    }
    async findAll(limit) {
        const logs = await this.activityLogsService.findAll(limit || 50);
        return { message: 'Activity logs retrieved successfully', data: logs, count: logs.length };
    }
    async findByMember(memberId, limit) {
        const logs = await this.activityLogsService.findByMember(memberId, limit || 50);
        return { message: 'Member activity logs retrieved successfully', data: logs, count: logs.length };
    }
    async findByBook(bookId, limit) {
        const logs = await this.activityLogsService.findByBook(bookId, limit || 50);
        return { message: 'Book activity logs retrieved successfully', data: logs, count: logs.length };
    }
    async findOne(id) {
        const log = await this.activityLogsService.findOne(id);
        return { message: 'Activity log retrieved successfully', data: log };
    }
    async remove(id) {
        await this.activityLogsService.remove(id);
        return { message: 'Activity log deleted successfully' };
    }
};
exports.ActivityLogsController = ActivityLogsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new activity log' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Activity log created successfully', type: activity_log_entity_1.ActivityLog }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_log_dto_1.CreateActivityLogDto]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "create", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all activity logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity logs retrieved successfully', type: [activity_log_entity_1.ActivityLog] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('member/:memberId'),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity logs by member ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member activity logs retrieved successfully', type: [activity_log_entity_1.ActivityLog] }),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findByMember", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('book/:bookId'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity logs by book ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Book activity logs retrieved successfully', type: [activity_log_entity_1.ActivityLog] }),
    __param(0, (0, common_1.Param)('bookId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findByBook", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity log by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity log retrieved successfully', type: activity_log_entity_1.ActivityLog }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Activity log not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete activity log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity log deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Activity log not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "remove", null);
exports.ActivityLogsController = ActivityLogsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Activity Logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('activity-logs'),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogsController);
//# sourceMappingURL=activity-logs.controller.js.map