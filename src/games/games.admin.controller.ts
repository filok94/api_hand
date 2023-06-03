import { Roles } from './../roles_guard/roles.decorator'
import { RolesGuard } from './../roles_guard/roles_guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ErrorMessages } from '../exceptions/exceptions'
import { DtoCreateGame } from './dto/create_game.dto'
import { DtoIdParams, DtoTitleBody } from './dto/queries.dto'
import { GamesService } from './games.service'

@UseGuards(AuthGuard(), RolesGuard)
@Controller('admin/games')
export class GamesAdminController {
  constructor (private gamesService: GamesService) {}

	@Roles('admin')
	@Post('create')
  @HttpCode(200)
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
  @Delete(':id')
	async deleteGame (@Param() params: DtoIdParams) {
	  try {
	    return await this.gamesService.adminDeleteGame(params.id)
	  } catch (e) {
	    const errorMessage = String(e.message)
	    if (errorMessage.includes(ErrorMessages.CANNOT_FIND_GAME)) {
	      throw new NotFoundException(errorMessage)
	    }
	    throw new InternalServerErrorException(errorMessage)
	  }
	}

  @Roles('admin')
  @Post('fake')
  @HttpCode(200)
  async createFakeGame (@Body() body: DtoTitleBody) {
    try {
      return await this.gamesService.createFakeGame(body.title)
    } catch (e) {
      const errorMessage = String(e.message)
	    throw new InternalServerErrorException(errorMessage)
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
