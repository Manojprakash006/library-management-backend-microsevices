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
exports.RacksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const racks_service_1 = require("../service/racks.service");
const rack_dto_1 = require("../dto/rack.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../auth/guards/roles.decorator");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
let RacksController = class RacksController {
    constructor(racksService) {
        this.racksService = racksService;
    }
    async findAll() {
        const racks = await this.racksService.findAll();
        return { message: 'Racks retrieved successfully', data: racks, count: racks.length };
    }
    async findOne(rackNumber) {
        const rack = await this.racksService.findByRackNumber(rackNumber);
        return { message: 'Rack details retrieved successfully', data: rack };
    }
};
exports.RacksController = RacksController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all racks with book summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Racks retrieved successfully', type: [rack_dto_1.RackDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':rackNumber'),
    (0, roles_decorator_1.Roles)('admin', 'staff', 'member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rack details by rack number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rack details retrieved successfully', type: rack_dto_1.RackDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rack not found' }),
    __param(0, (0, common_1.Param)('rackNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RacksController.prototype, "findOne", null);
exports.RacksController = RacksController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Racks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('racks'),
    __metadata("design:paramtypes", [racks_service_1.RacksService])
], RacksController);
//# sourceMappingURL=racks.controller.js.map