import { Roles } from './../roles_guard/roles.decorator'
import { RolesGuard } from './../roles_guard/roles_guard'
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ErrorMessages } from '../exceptions/exceptions'
import { DtoCreateGame } from './dto/create_game.dto'
import { DtoIdParams } from './dto/queries.dto'
import { GamesService } from './games.service'

@UseGuards(AuthGuard(), RolesGuard)
@Controller('admin/games')
export class GamesAdminController {
  constructor (private gamesService: GamesService) {}

	@Roles('admin')
	@Post('create')
  async createGame (@Body() dto: DtoCreateGame) {
    try {
      return await this.gamesService.adminCreateGame(dto)
    } catch (e) {
      const errorMessage = String(e.message)
      if (errorMessage.includes(ErrorMessages.PERSON_NOT_FOUND)) {
        throw new NotFoundException(errorMessage)
      }
      console.error(errorMessage)
      throw new InternalServerErrorException()
    }
  }

	@Roles('admin')
	@Get('get_game')
	async getGameById (@Query() query: DtoIdParams) {
	  try {
	    return await this.gamesService.adminGetGameById(query.id)
	  } catch (e) {
	    const errorMessage = String(e.message)
	    console.error(errorMessage)
	    throw new InternalServerErrorException()
	  }
	}
}
