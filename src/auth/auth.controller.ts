import { ExcepitonsStrings } from "./../exceptions/exceptions";
import { Token } from "./schemas/token.schema";
import { TokenService } from "./token.service";
import { ErrorMessages } from "../exceptions/exceptions";
import { UserDto } from "./dto/create-user.dto";
import loginDto from "./dto/login-dto";
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Post,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import RefreshTokenDto from "./dto/refresh-token.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private tokenService: TokenService
	) {}

	@Post("/sign_up")
	async registrationUser(@Body() dto: UserDto) {
		try {
			const answer = await this.authService.signUp(dto);
			const access_token = answer.access_token;
			const refresh_token = answer.refresh_token;
			return { access_token, refresh_token };
		} catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.DUPLICATES_10011)) {
				throw new ConflictException().getResponse();
			} else {
				console.log(errorMessage);
				throw new InternalServerErrorException().getResponse();
			}
		}
	}

	@Post("/sign_in")
	@HttpCode(200)
	async login(@Body() dto: loginDto) {
		try {
			const { user, access_token, refresh_token } =
				await this.authService.signIn(dto);
			return { user, access_token, refresh_token };
		} catch (e) {
			if (
				e.message.includes("Cannot read properties") ||
				e.message.includes("wrong password")
			) {
				throw new UnauthorizedException(
					"invalid user or password"
				).getResponse();
			} else {
				console.log(e.message);
				throw new InternalServerErrorException().getResponse();
			}
		}
	}

	@Post("refresh_tokens")
	@HttpCode(200)
	async refreshTokens(@Body() dto: RefreshTokenDto) {
		try {
			const { access_token, refresh_token, user } =
				await this.tokenService.refreshTokens(dto.refresh_token);

			return { access_token, refresh_token, user };
		} catch (e) {
			const errorMessage = String(e.message);
			if (
				errorMessage.includes("user is null") ||
				errorMessage.includes("Cannot read properties of")
			) {
				throw new HttpException(
					ErrorMessages.NOT_FOUND,
					HttpStatus.NOT_FOUND
				).getResponse();
			} else if (errorMessage.includes(ErrorMessages.CANNOT_FIND_TOKEN)) {
				throw new BadRequestException(errorMessage).getResponse();
			} else {
				console.log(e.message);
				throw new InternalServerErrorException().getResponse();
			}
		}
	}
}
