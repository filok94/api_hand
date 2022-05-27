/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<any>;
    deleteAllUsers(): Promise<boolean>;
    getAllTokens(): Promise<(import("mongoose").Document<unknown, any, import("../auth/schemas/token.schema").TokenDocument> & import("../auth/schemas/token.schema").Token & Document & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
