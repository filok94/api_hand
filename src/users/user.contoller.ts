import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/get_all")
  getAllUsers() {
    try {
      return this.userService.getAllUsers();
    } catch (e) {
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Get("/get_all_tokens")
  async getAllTokens() {
    try {
      return await this.userService.getAllTokens();
    } catch (e) {
      throw new InternalServerErrorException().getResponse();
    }
  }
}
