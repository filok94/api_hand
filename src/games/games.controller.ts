import { AuthGuard } from "@nestjs/passport";
import { IReturnedCalculatedData } from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/calculate.dto";
import { ErrorMessages, ExcepitonsStrings } from "../exceptions/exceptions";
import { GamesService } from "./games.service";
import {
	Body,
	Controller,
	Get,
	Query,
	BadRequestException,
	InternalServerErrorException,
	Headers,
	Put,
	UseGuards,
	NotFoundException,
} from "@nestjs/common";
import { DtoGameIdQuery } from "./dto/queries.dto";
import { IHeader } from "src/common/common_interfaces";

@UseGuards(AuthGuard())
@Controller("games")
export class GamesController {
	constructor(private gamesService: GamesService) {}

	@Get("get_all")
	async getAllGames() {
		try {
			return await this.gamesService.getAllGames();
		} catch (e) {
			console.log(e.message);
			throw new InternalServerErrorException();
		}
	}

	@Get("get_questions")
	async getQuestionWithAnswers(
		@Query() params: DtoGameIdQuery
	): Promise<IReturnedOneQuestion[]> {
		try {
			return await this.gamesService.getQuestionsForGame(params);
		} catch (e) {
			const errorMessage = String(e.message);
			console.log(errorMessage);
			throw new InternalServerErrorException();
		}
	}

	@Put("calculate")
	async isAnswerRight(
		@Body() body: DtoCalculate,
		@Headers() headers: IHeader
	): Promise<IReturnedCalculatedData> {
		try {
			return await this.gamesService.setResultData(body, headers.token);
		} catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.WRONG_GAME_ID)) {
				throw new NotFoundException(errorMessage);
			} else if (errorMessage.includes(ErrorMessages.WRONG_QUESTION_DATA)) {
				throw new BadRequestException(errorMessage);
			}
			throw new InternalServerErrorException();
		}
	}

	@Get("get_results")
	async getGameResultsByGameId(
		@Query() query: DtoGameIdQuery,
		@Headers() headers: IHeader
	) {
		try {
			return await this.gamesService.getUserResults({
				game: query.game_id,
				user: headers.token,
			});
		} catch (e) {
			const errorMessage = String(e.message);
			const errorHaveNoResultsOnThisGame =
				ExcepitonsStrings.CANNOT_READ_NULL + " (reading '_id')";

			if (errorMessage.includes(errorHaveNoResultsOnThisGame)) {
				throw new BadRequestException({
					message: "user have no results on this game",
				});
			}
			console.log(errorMessage);
			throw new InternalServerErrorException();
		}
	}
}
