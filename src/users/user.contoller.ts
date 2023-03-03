import { ErrorMessages } from './../exceptions/exceptions'
import { SetUserAdminDto } from './dto/set_user_admin.dto'
import { RolesGuard } from './../roles_guard/roles_guard'
import { Roles } from './../roles_guard/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards
} from '@nestjs/common'

@UseGuards(AuthGuard(), RolesGuard)
@Controller('users')
export class UserController {
  constructor (private userService: UserService) {}

	@Roles('admin')
	@Get('/get_all')
  async getAllUsers () {
    try {
      return await this.userService.getAllUsers()
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

	@Roles('admin')
	@Post('/set_admin')
	@HttpCode(200)
	async setUserAdmin (@Body() dto: SetUserAdminDto) {
	  try {
	    return await this.userService.setUserAdmin(dto)
	  } catch (e) {
	    const errorMessage = String(e.message)
	    console.error(errorMessage)
	    if (errorMessage.includes(ErrorMessages.CANNOT_FIND_LOGIN)) {
	      throw new BadRequestException(errorMessage)
	    }
	    throw new InternalServerErrorException()
	  }
	}
}
