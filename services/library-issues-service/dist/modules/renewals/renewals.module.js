"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const renewals_controller_1 = require("./controller/renewals.controller");
const renewals_service_1 = require("./service/renewals.service");
const book_renewal_entity_1 = require("./entities/book-renewal.entity");
let RenewalsModule = class RenewalsModule {
};
exports.RenewalsModule = RenewalsModule;
exports.RenewalsModule = RenewalsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: book_renewal_entity_1.BookRenewal.name, schema: book_renewal_entity_1.BookRenewalSchema },
            ]),
        ],
        controllers: [renewals_controller_1.RenewalsController],
        providers: [renewals_service_1.RenewalsService],
        exports: [renewals_service_1.RenewalsService],
    })
], RenewalsModule);
//# sourceMappingURL=renewals.module.js.map