import { Token } from "./schemas/token.schema";
import { User, UserDocument } from "./schemas/user.schema";
import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import mongoose from "mongoose";
import loginDto from "./dto/login-dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private tokenService: TokenService
	) {}

	async signUp(dto: UserDto): Promise<Token> {
		try {
			const hashPassword = await bcrypt.hash(dto.password, 12);
			await this.userModel.create({
				password: hashPassword,
				login: dto.login,
				is_admin: false,
			});

			const tokens = await this.signIn({
				login: dto.login,
				password: dto.password,
			});
			return tokens;
		} catch (e) {
			throw new Error(e);
		}
	}

	async signIn(dto: loginDto): Promise<Token> {
		try {
			const user = await this.userModel.findOne({ login: dto.login });
			const isPassword = await bcrypt.compare(dto.password, user.password);

			if (user && isPassword) {
				return await this.tokenService.createToken({ ...dto });
			} else {
				throw new Error("wrong password");
			}
		} catch (e) {
			throw new Error(e);
		}
	}
}
