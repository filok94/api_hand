import mongoose from 'mongoose';
export declare type AuthDocument = Token & Document;
export declare class Token {
    refreshToken: string;
    user: mongoose.Schema.Types.ObjectId;
}
export declare const TokenSchema: mongoose.Schema<mongoose.Document<Token, any, any>, mongoose.Model<mongoose.Document<Token, any, any>, any, any, any>, {}, {}>;
