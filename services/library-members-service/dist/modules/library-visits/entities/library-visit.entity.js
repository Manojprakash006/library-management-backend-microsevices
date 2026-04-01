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
exports.LibraryVisitSchema = exports.LibraryVisit = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LibraryVisit = class LibraryVisit {
};
exports.LibraryVisit = LibraryVisit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LibraryVisit.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], LibraryVisit.prototype, "timeIn", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], LibraryVisit.prototype, "timeOut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['reading', 'issue', 'return', 'other'], default: 'reading' }),
    __metadata("design:type", String)
], LibraryVisit.prototype, "purpose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], LibraryVisit.prototype, "bookIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], LibraryVisit.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LibraryVisit.prototype, "isActive", void 0);
exports.LibraryVisit = LibraryVisit = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LibraryVisit);
exports.LibraryVisitSchema = mongoose_1.SchemaFactory.createForClass(LibraryVisit);
//# sourceMappingURL=library-visit.entity.js.map