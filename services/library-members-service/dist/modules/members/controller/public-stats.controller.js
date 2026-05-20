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
exports.PublicStatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const members_service_1 = require("../service/members.service");
const public_decorator_1 = require("../../../auth/guards/public.decorator");
let PublicStatsController = class PublicStatsController {
    constructor(membersService) {
        this.membersService = membersService;
        this.lastCount = 0;
        this.lastFetchTime = 0;
        this.CACHE_TIME = 30 * 60 * 1000;
    }
    async getPublicCount() {
        const currentTime = Date.now();
        if (currentTime - this.lastFetchTime > this.CACHE_TIME || this.lastCount === 0) {
            this.lastCount = await this.membersService.getCount();
            this.lastFetchTime = currentTime;
        }
        return { data: this.lastCount };
    }
};
exports.PublicStatsController = PublicStatsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('member-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total members count for landing page (Cached)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicStatsController.prototype, "getPublicCount", null);
exports.PublicStatsController = PublicStatsController = __decorate([
    (0, swagger_1.ApiTags)('Public Stats'),
    (0, common_1.Controller)('public-stats'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], PublicStatsController);
//# sourceMappingURL=public-stats.controller.js.map