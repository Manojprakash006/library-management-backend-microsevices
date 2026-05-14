"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const util_controller_1 = require("./controller/util.controller");
const util_service_1 = require("./service/util.service");
const book_entity_1 = require("../books/entities/book.entity");
let UtilModule = class UtilModule {
};
exports.UtilModule = UtilModule;
exports.UtilModule = UtilModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: book_entity_1.Book.name, schema: book_entity_1.BookSchema }])],
        controllers: [util_controller_1.UtilController],
        providers: [util_service_1.UtilService],
        exports: [util_service_1.UtilService],
    })
], UtilModule);
//# sourceMappingURL=util.module.js.map