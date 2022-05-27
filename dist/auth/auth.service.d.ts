import { Token } from './schemas/token.schema';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/create-user.dto';
import { TokenService } from './token.service';
import loginDto from './dto/login-dto';
export declare class AuthService {
    private userModel;
    private tokenService;
    constructor(userModel: Model<UserDocument>, tokenService: TokenService);
    signUp(dto: UserDto): Promise<Token | number>;
    signIn(dto: loginDto): Promise<Token>;
}
