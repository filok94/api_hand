import { TokenService } from "./token.service";
import { ErrorMessages } from "../exceptions/exceptions";
import loginDto from "./dto/login.dto";
import { Body,
	ConflictException,
	Controller,
	HttpCode,
	InternalServerErrorException,
	NotFoundException,
	Post,
	UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import RefreshTokenDto from "./dto/refresh_token.dto";
import LoginDto from "./dto/login.dto";

@Controller("auth")
export class AuthController {
	constructor (
		private authService: AuthService,
		private tokenService: TokenService
	) {}

	@Post("/sign_up")
	@HttpCode(200)
	async registrationUser (@Body() dto: LoginDto) {
		try {
			const { access_token, refresh_token, user, is_admin } =
				await this.authService.signUp(dto);
			return {
				access_token, refresh_token, user, is_admin
			};
		}
		catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.DUPLICATES_IN_COLLECTION)) {
				throw new ConflictException();
			}
			else {
				console.log(errorMessage);
				throw new InternalServerErrorException();
			}
		}
	}

	@Post("/sign_in")
	@HttpCode(200)
	async login (@Body() dto: loginDto) {
		try {
			const { user, access_token, refresh_token, is_admin } =
				await this.authService.signIn(dto);
			return {
				user, access_token, refresh_token, is_admin
			};
		}
		catch (e) {
			if (
				e.message.includes("Cannot read properties") ||
				e.message.includes("wrong password")
			) {
				throw new UnauthorizedException("invalid user or password");
			}
			else {
				console.log(e.message);
				throw new InternalServerErrorException();
			}
		}
	}

	@Post("refresh_tokens")
	@HttpCode(200)
	async refreshTokens (@Body() dto: RefreshTokenDto) {
		try {
			const { access_token, refresh_token, user, is_admin } =
				await this.tokenService.refreshTokens(dto.refresh_token);
			return {
				access_token, refresh_token, user, is_admin
			};
		}
		catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.TOKEN_EXPIRED)) {
				throw new UnauthorizedException(ErrorMessages.TOKEN_EXPIRED);
			}
			if (errorMessage.includes(ErrorMessages.CANNOT_FIND_TOKEN)) {
				throw new NotFoundException(ErrorMessages.CANNOT_FIND_TOKEN);
			}
			else {
				console.log(e.message);
				throw new InternalServerErrorException();
			}
		}
	}
}
