import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User> & {
    matchPassword(enteredPassword: string): Promise<boolean>;
};
export declare class User {
    name: string;
    email: string;
    address: string;
    phone: string;
    password: string;
    role: string;
}
export declare const UserSchema: any;
