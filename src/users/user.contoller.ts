import { RolesGuard } from "./../roles_guard/roles_guard";
import { Roles } from "./../roles_guard/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";

@UseGuards(AuthGuard(), RolesGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Roles("admin")
  @Get("/get_all")
  getAllUsers() {
    try {
      return this.userService.getAllUsers();
    } catch (e) {
      throw new InternalServerErrorException().getResponse();
    }
  }
}
