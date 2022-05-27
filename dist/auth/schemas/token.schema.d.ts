import mongoose from 'mongoose';
export declare type TokenDocument = Token & Document;
export declare class Token {
    refresh_token: string;
    access_token: string;
    user?: mongoose.Schema.Types.ObjectId;
}
export declare const TokenSchema: mongoose.Schema<mongoose.Document<Token, any, any>, mongoose.Model<mongoose.Document<Token, any, any>, any, any, any>, {}, {}>;
