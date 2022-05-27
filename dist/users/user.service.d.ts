/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { TokenService } from './../auth/token.service';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private userModel;
    private tokenService;
    constructor(userModel: Model<UserDocument>, tokenService: TokenService);
    getAllUsers(): Promise<any>;
    getUserByEmail(email: string): Promise<User>;
    deleteAllUsers(): Promise<boolean>;
    getAllTokens(): Promise<(import("mongoose").Document<unknown, any, import("../auth/schemas/token.schema").TokenDocument> & import("../auth/schemas/token.schema").Token & Document & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
