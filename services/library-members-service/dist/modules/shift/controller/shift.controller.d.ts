import { ShiftService } from '../service/shift.service';
import { CreateShiftDto, UpdateShiftDto } from '../dto/shift.dto';
export declare class ShiftController {
    private readonly shiftService;
    constructor(shiftService: ShiftService);
    create(dto: CreateShiftDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateShiftDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../entities/shift.entity").Shift, {}, {}> & import("../entities/shift.entity").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
