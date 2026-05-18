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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_entity_1 = require("../entities/config.entity");
let ConfigService = class ConfigService {
    constructor(configModel) {
        this.configModel = configModel;
    }
    async onModuleInit() {
        const config = await this.configModel.findOne({ configKey: 'DEFAULT' }).exec();
        if (!config) {
            const defaultConfig = new this.configModel({
                configKey: 'DEFAULT',
                maxRackCapacity: 50,
                maxShelfCapacity: 10,
            });
            await defaultConfig.save();
        }
    }
    async getConfig() {
        return this.configModel.findOne({ configKey: 'DEFAULT' }).exec();
    }
    async updateConfig(updateConfigDto) {
        return this.configModel
            .findOneAndUpdate({ configKey: 'DEFAULT' }, updateConfigDto, { new: true })
            .exec();
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(config_entity_1.Config.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConfigService);
//# sourceMappingURL=config.service.js.map