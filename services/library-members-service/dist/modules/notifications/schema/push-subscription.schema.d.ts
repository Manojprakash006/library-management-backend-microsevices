import { Document } from 'mongoose';
export declare class PushSubscription extends Document {
    userId: string;
    subscription: any;
    deviceInfo?: string;
}
export declare const PushSubscriptionSchema: any;
