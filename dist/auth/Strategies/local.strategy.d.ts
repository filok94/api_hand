import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import LoginDto from '../dto/login-dto';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(user: LoginDto): Promise<any>;
}
export {};
