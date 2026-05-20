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
exports.ShiftService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_entity_1 = require("../entities/shift.entity");
let ShiftService = class ShiftService {
    constructor(shiftModel) {
        this.shiftModel = shiftModel;
    }
    async onModuleInit() {
        const count = await this.shiftModel.countDocuments();
        if (count === 0) {
            await this.shiftModel.create({
                name: 'General',
                startTime: '09:00 AM',
                endTime: '06:00 PM',
                gracePeriod: 15,
                lunchDuration: 60,
            });
        }
    }
    async create(dto) {
        const existing = await this.shiftModel.findOne({ name: dto.name });
        if (existing) {
            throw new common_1.ConflictException('Shift name already exists');
        }
        const shift = new this.shiftModel(dto);
        return await shift.save();
    }
    async findAll() {
        return await this.shiftModel.find({ isActive: true }).exec();
    }
    async findOne(id) {
        const shift = await this.shiftModel.findById(id);
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        return shift;
    }
    async update(id, dto) {
        const shift = await this.shiftModel.findByIdAndUpdate(id, dto, { new: true });
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        return shift;
    }
    async remove(id) {
        const shift = await this.shiftModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        return shift;
    }
};
exports.ShiftService = ShiftService;
exports.ShiftService = ShiftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_entity_1.Shift.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShiftService);
//# sourceMappingURL=shift.service.js.map