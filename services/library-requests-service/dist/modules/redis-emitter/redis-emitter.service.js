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
var RedisEmitterService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisEmitterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisEmitterService = RedisEmitterService_1 = class RedisEmitterService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisEmitterService_1.name);
    }
    get client() {
        return this._redisClient;
    }
    onModuleInit() {
        const host = this.configService.get('REDIS_HOST', 'redis');
        const port = this.configService.get('REDIS_PORT', 6379);
        this._redisClient = new ioredis_1.default({
            host,
            port,
        });
        this._redisClient.on('connect', () => {
            this.logger.log(`Connected to Redis at ${host}:${port}`);
        });
        this._redisClient.on('error', (err) => {
            this.logger.error('Redis connection error', err);
        });
    }
    onModuleDestroy() {
        this._redisClient.disconnect();
    }
    async emit(event, data) {
        try {
            const payload = JSON.stringify({ event, data });
            await this._redisClient.publish('lms_updates', payload);
            this.logger.log(`Published event: ${event}`);
        }
        catch (error) {
            this.logger.error(`Failed to publish event: ${event}`, error);
        }
    }
};
exports.RedisEmitterService = RedisEmitterService;
exports.RedisEmitterService = RedisEmitterService = RedisEmitterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RedisEmitterService);
//# sourceMappingURL=redis-emitter.service.js.map