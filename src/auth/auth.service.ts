import { Token } from "./schemas/token.schema";
import { User, UserDocument } from "./schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import LoginDto from "./dto/login.dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private tokenService: TokenService
	) {}

	async signUp(dto: LoginDto): Promise<Token> {
		try {
			const hashPassword = await bcrypt.hash(dto.password, 12);
			await this.userModel.create({
				password: hashPassword,
				login: dto.login,
				is_admin: false,
			});

			const tokens = await this.tokenService.createToken({ ...dto });
			return tokens;
		} catch (e) {
			throw new Error(e);
		}
	}

	async signIn(dto: LoginDto): Promise<Token> {
		try {
			const user = await this.userModel.findOne({ login: dto.login });
			const isPasswordCorrect = await bcrypt.compare(
				dto.password,
				user.password
			);

			if (user && isPasswordCorrect) {
				return await this.tokenService.createToken({ ...dto });
			} else {
				throw new Error("wrong password");
			}
		} catch (e) {
			throw new Error(e);
		}
	}
}
