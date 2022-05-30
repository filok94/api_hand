import { TokenService } from "./token.service";
import { ErrorMessages } from "../exceptions/exceptions";
import { UserDto } from "./dto/create-user.dto";
import loginDto from "./dto/login-dto";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import RefreshTokenDto from "./dto/refresh-token.dto";
import mongoose from "mongoose";

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

      if (typeof answer == "number") {
        throw new Error(ErrorMessages.ALREADY_IN_USE);
      } else {
        const access_token = answer.access_token;
        const refresh_token = answer.refresh_token;
        return { access_token, refresh_token };
      }
    } catch (e) {
      if (e.message == ErrorMessages.ALREADY_IN_USE) {
        throw new ConflictException().getResponse();
      } else {
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
      console.log(e.message);
      if (
        e.message.includes("Cannot read properties") ||
        e.message.includes("wrong password")
      ) {
        throw new UnauthorizedException().getResponse();
      } else {
        throw new InternalServerErrorException().getResponse();
      }
    }
  }

  @Post("/refresh_tokens")
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    try {
      const { access_token, refresh_token } =
        await this.tokenService.refreshTokens(dto.refresh_token);
      return { access_token, refresh_token };
    } catch (e) {
      console.log(e.message);
      if (
        e.message.includes("user is null") ||
        e.message.includes("Cannot read properties of")
      ) {
        throw new HttpException(
          ErrorMessages.NOT_FOUND,
          HttpStatus.NOT_FOUND
        ).getResponse();
      } else {
        throw new InternalServerErrorException().getResponse();
      }
    }
  }
}
