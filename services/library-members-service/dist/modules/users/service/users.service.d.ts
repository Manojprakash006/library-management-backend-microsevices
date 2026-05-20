import { Model } from 'mongoose';
import { Member } from '../../members/entities/member.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersService {
    private memberModel;
    constructor(memberModel: Model<Member>);
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, Member, {}, {}> & Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfile(userId: string, updateDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, Member, {}, {}> & Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    listUsers(): Promise<(import("mongoose").Document<unknown, {}, Member, {}, {}> & Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
