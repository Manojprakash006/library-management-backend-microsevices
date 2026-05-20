import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Shift, ShiftDocument } from '../entities/shift.entity';
import { CreateShiftDto, UpdateShiftDto } from '../dto/shift.dto';
export declare class ShiftService implements OnModuleInit {
    private shiftModel;
    constructor(shiftModel: Model<ShiftDocument>);
    onModuleInit(): Promise<void>;
    create(dto: CreateShiftDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateShiftDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
