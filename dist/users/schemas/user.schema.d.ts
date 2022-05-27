import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type UserDocument = User & Document;
export declare class User {
    id: mongoose.Schema.Types.ObjectId;
    email: string;
    password: string;
}
export declare const UserSchema: mongoose.Schema<mongoose.Document<User, any, any>, mongoose.Model<mongoose.Document<User, any, any>, any, any, any>, {}, {}>;
