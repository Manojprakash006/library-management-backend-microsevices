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
exports.LibraryVisitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const library_visits_service_1 = require("../service/library-visits.service");
const library_visit_dto_1 = require("../dto/library-visit.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let LibraryVisitsController = class LibraryVisitsController {
    constructor(libraryVisitsService) {
        this.libraryVisitsService = libraryVisitsService;
    }
    async autoRecordVisit(data) {
        const result = await this.libraryVisitsService.createVisitForBookIssue(data.memberId, data.bookId, data.purpose, new Date(data.timeIn), data.timeOut ? new Date(data.timeOut) : null);
        return { message: 'Library visit auto-recorded', data: result };
    }
    async recordReturn(data) {
        const result = await this.libraryVisitsService.recordReturnVisit(data.memberId, data.bookId);
        return { message: 'Return visit recorded', data: result };
    }
    async checkIn(checkInDto) {
        const result = await this.libraryVisitsService.checkIn(checkInDto);
        return { message: 'Check-in successful', data: result.data };
    }
    async checkOut(checkOutDto) {
        const result = await this.libraryVisitsService.checkOut(checkOutDto);
        return { message: 'Check-out successful', data: result.data };
    }
    async getTodaysVisits() {
        const visits = await this.libraryVisitsService.getTodaysVisits();
        return { message: 'Today\'s visits retrieved', data: visits };
    }
    async getActiveVisits() {
        const visits = await this.libraryVisitsService.getActiveVisits();
        return { message: 'Active visits retrieved', count: visits.length, data: visits };
    }
    async getMyHistory(req) {
        const memberId = req.user?.userId;
        const visits = await this.libraryVisitsService.getMemberVisitHistory(memberId);
        return { message: 'Visit history retrieved', data: visits };
    }
};
exports.LibraryVisitsController = LibraryVisitsController;
__decorate([
    (0, common_1.Post)('auto-record'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Auto record library visit from issues service (internal)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "autoRecordVisit", null);
__decorate([
    (0, common_1.Post)('record-return'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record return visit when book is returned (internal)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "recordReturn", null);
__decorate([
    (0, common_1.Post)('check-in'),
    (0, roles_decorator_1.Roles)('staff', 'admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Member check-in to library' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [library_visit_dto_1.CheckInDto]),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    (0, roles_decorator_1.Roles)('staff', 'admin', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Member check-out from library' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [library_visit_dto_1.CheckOutDto]),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, roles_decorator_1.Roles)('staff', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all visits for today' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "getTodaysVisits", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, roles_decorator_1.Roles)('staff', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get currently active visits' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "getActiveVisits", null);
__decorate([
    (0, common_1.Get)('my-history'),
    (0, roles_decorator_1.Roles)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get member own visit history' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryVisitsController.prototype, "getMyHistory", null);
exports.LibraryVisitsController = LibraryVisitsController = __decorate([
    (0, swagger_1.ApiTags)('Library Visits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('library-visits'),
    __metadata("design:paramtypes", [library_visits_service_1.LibraryVisitsService])
], LibraryVisitsController);
//# sourceMappingURL=library-visits.controller.js.map