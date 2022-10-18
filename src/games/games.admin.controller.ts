import { Roles } from "./../roles_guard/roles.decorator";
import { RolesGuard } from "./../roles_guard/roles_guard";
import {
	Body,
	Controller,
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

@UseGuards(AuthGuard(), RolesGuard)
@Controller("admin/games")
export class GamesAdminController {
	constructor(private gamesService: GamesService) {}

	@Roles("admin")
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
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
	@Roles("admin")
	@Get("get_game")
	async getGameById(@Query() query: DtoGameIdQuery) {
		try {
			return await this.gamesService.adminGetGameById(query.game_id);
		} catch (e) {
			const errorMessage = String(e.message);
			console.error(errorMessage);
			throw new InternalServerErrorException();
		}
	}
}
