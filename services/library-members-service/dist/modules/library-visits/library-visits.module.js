"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryVisitsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const library_visits_controller_1 = require("./controller/library-visits.controller");
const library_visits_service_1 = require("./service/library-visits.service");
const library_visit_entity_1 = require("./entities/library-visit.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let LibraryVisitsModule = class LibraryVisitsModule {
};
exports.LibraryVisitsModule = LibraryVisitsModule;
exports.LibraryVisitsModule = LibraryVisitsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: library_visit_entity_1.LibraryVisit.name, schema: library_visit_entity_1.LibraryVisitSchema },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [library_visits_controller_1.LibraryVisitsController],
        providers: [library_visits_service_1.LibraryVisitsService],
        exports: [library_visits_service_1.LibraryVisitsService],
    })
], LibraryVisitsModule);
//# sourceMappingURL=library-visits.module.js.map