import { FavouriteService } from '../service/favourite.service';
import { ToggleFavouriteDto } from '../dto/favourite.dto';
export declare class FavouriteController {
    private readonly favouriteService;
    constructor(favouriteService: FavouriteService);
    toggle(dto: ToggleFavouriteDto): Promise<{
        status: string;
        bookId: string;
    }>;
    getAll(userId: string): Promise<{
        book: any;
        userId: import("mongoose").Types.ObjectId;
        bookId: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
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
