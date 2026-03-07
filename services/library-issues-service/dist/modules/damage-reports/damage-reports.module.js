"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageReportsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const damage_reports_controller_1 = require("./controller/damage-reports.controller");
const damage_reports_service_1 = require("./service/damage-reports.service");
const book_damage_report_entity_1 = require("./entities/book-damage-report.entity");
let DamageReportsModule = class DamageReportsModule {
};
exports.DamageReportsModule = DamageReportsModule;
exports.DamageReportsModule = DamageReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: book_damage_report_entity_1.BookDamageReport.name, schema: book_damage_report_entity_1.BookDamageReportSchema },
            ]),
        ],
        controllers: [damage_reports_controller_1.DamageReportsController],
        providers: [damage_reports_service_1.DamageReportsService],
        exports: [damage_reports_service_1.DamageReportsService],
    })
], DamageReportsModule);
//# sourceMappingURL=damage-reports.module.js.map