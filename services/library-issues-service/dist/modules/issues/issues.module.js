"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const issues_controller_1 = require("./controller/issues.controller");
const issues_service_1 = require("./service/issues.service");
const issue_book_entity_1 = require("./entities/issue-book.entity");
let IssuesModule = class IssuesModule {
};
exports.IssuesModule = IssuesModule;
exports.IssuesModule = IssuesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: issue_book_entity_1.IssueBook.name, schema: issue_book_entity_1.IssueBookSchema }])],
        controllers: [issues_controller_1.IssuesController],
        providers: [issues_service_1.IssuesService],
        exports: [issues_service_1.IssuesService],
    })
], IssuesModule);
//# sourceMappingURL=issues.module.js.map