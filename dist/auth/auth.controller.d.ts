import { TokenService } from './token.service';
import { UserDto } from './dto/create-user.dto';
import loginDto from './dto/login-dto';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import mongoose from 'mongoose';
export declare class AuthController {
    private authService;
    private tokenService;
    constructor(authService: AuthService, tokenService: TokenService);
    registrationUser(dto: UserDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: loginDto): Promise<{
        user: mongoose.Schema.Types.ObjectId;
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(dto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
