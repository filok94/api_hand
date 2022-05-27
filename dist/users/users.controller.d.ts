import { UserService } from './users.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllGames(): Promise<any>;
}
