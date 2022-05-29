import { UserDocument } from "./schemas/user.schema";
import { UserDto } from "./dto/create-user.dto";
import { Token, TokenDocument } from "./schemas/token.schema";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import mongoose from "mongoose";
export declare class TokenService {
    private tokenModel;
    private jwtService;
    private userModel;
    constructor(tokenModel: Model<TokenDocument>, jwtService: JwtService, userModel: Model<UserDocument>);
    getTokenByUser(id: string): Promise<Token>;
    getUserByToken(token: string): Promise<mongoose.Schema.Types.ObjectId>;
    createToken(payload: UserDto): Promise<Token>;
    refreshTokens(token: mongoose.Schema.Types.ObjectId): Promise<Token>;
    getAllTokens(): Promise<(mongoose.Document<unknown, any, TokenDocument> & Token & Document & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    deleteAllTokens(): Promise<import("mongodb").DeleteResult>;
}
