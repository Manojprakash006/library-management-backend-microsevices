"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_module_1 = require("../../config/config.module");
const fine_entity_1 = require("./entities/fine.entity");
const fines_service_1 = require("./service/fines.service");
const fines_controller_1 = require("./controller/fines.controller");
const fines_grpc_controller_1 = require("./controller/fines-grpc.controller");
let FinesModule = class FinesModule {
};
exports.FinesModule = FinesModule;
exports.FinesModule = FinesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: fine_entity_1.Fine.name, schema: fine_entity_1.FineSchema }]),
            config_module_1.ConfigModule,
        ],
        controllers: [fines_controller_1.FinesController, fines_grpc_controller_1.FinesGrpcController],
        providers: [fines_service_1.FinesService],
        exports: [fines_service_1.FinesService],
    })
], FinesModule);
//# sourceMappingURL=fines.module.js.map