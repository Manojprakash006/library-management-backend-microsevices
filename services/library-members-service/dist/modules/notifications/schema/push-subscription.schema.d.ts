import { Document } from 'mongoose';
export declare class PushSubscription extends Document {
    userId: string;
    subscription: any;
    deviceInfo?: string;
}
export declare const PushSubscriptionSchema: import("mongoose").Schema<PushSubscription, import("mongoose").Model<PushSubscription, any, any, any, Document<unknown, any, PushSubscription, any, {}> & PushSubscription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PushSubscription, Document<unknown, {}, import("mongoose").FlatRecord<PushSubscription>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<PushSubscription> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
