import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type UserDocument = User & Document;
export declare class User {
    email: string;
    password: string;
    isAdmin: boolean;
    _id?: mongoose.Schema.Types.ObjectId;
}
export declare const UserSchema: mongoose.Schema<mongoose.Document<User, any, any>, mongoose.Model<mongoose.Document<User, any, any>, any, any, any>, {}, {}>;
