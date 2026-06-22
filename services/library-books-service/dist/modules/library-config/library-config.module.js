"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryConfigModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_controller_1 = require("./controller/config.controller");
const config_service_1 = require("./service/config.service");
const config_entity_1 = require("./entities/config.entity");
let LibraryConfigModule = class LibraryConfigModule {
};
exports.LibraryConfigModule = LibraryConfigModule;
exports.LibraryConfigModule = LibraryConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: config_entity_1.Config.name, schema: config_entity_1.ConfigSchema }]),
        ],
        controllers: [config_controller_1.ConfigController],
        providers: [config_service_1.ConfigService],
        exports: [config_service_1.ConfigService],
    })
], LibraryConfigModule);
//# sourceMappingURL=library-config.module.js.map