import { FavouriteDocument } from '../entities/favourite.entity';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
export declare class FavouriteService {
    private favouriteModel;
    private httpService;
    constructor(favouriteModel: Model<FavouriteDocument>, httpService: HttpService);
    toggleFavourite(userId: string, bookId: string): Promise<{
        status: string;
        bookId: string;
    }>;
    getFavourites(userId: string): Promise<{
        book: any;
        userId: Types.ObjectId;
        bookId: Types.ObjectId;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
}
