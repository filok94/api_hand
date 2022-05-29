import { TokenService } from "./../token.service";
import { Strategy } from "passport-jwt";
import { IDecodedToken } from "src/users/users.interface";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private tokenService;
    constructor(tokenService: TokenService);
    validate(payload: IDecodedToken): Promise<boolean>;
}
export {};
