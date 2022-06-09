import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ErrorMessages } from "../exceptions/exceptions";
import { DtoCreateGame } from "./dto/create_game.dto";
import { DtoGameIdQuery } from "./dto/queries.dto";
import { GamesService } from "./games.service";

@UseGuards(AuthGuard())
@Controller("admin/games")
export class GamesAdminController {
  constructor(private gamesService: GamesService) {}

  @Post("create")
  async createGame(@Body() dto: DtoCreateGame) {
    try {
      return await this.gamesService.adminCreateGame(dto);
    } catch (e) {
      const errorMessage = String(e.message);
      console.error(errorMessage);
      if (errorMessage.includes("E11000")) {
        throw new HttpException(
          `one of persons ${ErrorMessages.DUPLICATES}`,
          HttpStatus.BAD_REQUEST
        );
      } else if (errorMessage.includes(ErrorMessages.PERSON_NOT_FOUND)) {
        throw new HttpException(
          ErrorMessages.PERSON_NOT_FOUND,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new InternalServerErrorException().getResponse();
      }
    }
  }
  @Delete("delete_all")
  async deleteAllGames() {
    try {
      const deletedCount = await this.gamesService.adminDeleteAllGames();
      return { deleted: deletedCount };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Get("get_game")
  async getGameById(@Query() query: DtoGameIdQuery) {
    try {
      return await this.gamesService.adminGetGameById(query.game_id);
    } catch (e) {
      const errorMessage = String(e.message);
      console.error(errorMessage);
      throw new InternalServerErrorException().getResponse();
    }
  }
}