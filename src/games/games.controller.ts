import { AuthGuard } from "@nestjs/passport";
import { IReturnedCalculatedData } from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/calculate.dto";
import { ErrorMessages } from "../exceptions/exceptions";
import { GamesService } from "./games.service";
import { Body,
	Controller,
	Get,
	BadRequestException,
	InternalServerErrorException,
	Headers,
	Put,
	UseGuards,
	NotFoundException,
	Param } from "@nestjs/common";
import { DtoIdParams } from "./dto/queries.dto";
import { IHeader } from "../common/common_interfaces";

@UseGuards(AuthGuard())
@Controller("games")
export class GamesController {
	constructor (private gamesService: GamesService) { }
	@Get()
	async getAllGames () {
		try {
			return await this.gamesService.getAllGames();
		}
		catch (e) {
			console.log(e.message);
			throw new InternalServerErrorException();
		}
	}

	@Get(":id")
	async getQuestionWithAnswers (
		@Param() params: DtoIdParams
	): Promise<IReturnedOneQuestion[]> {
		try {
			return await this.gamesService.getQuestionsForGame(params);
		}
		catch (e) {
			const errorMessage = String(e.message);
			console.log(errorMessage);
			throw new InternalServerErrorException();
		}
	}

	@Put(":id/calculate")
	async isAnswerRight (
		@Param() params: DtoIdParams,
		@Body() body: DtoCalculate,
		@Headers() headers: IHeader
	): Promise<IReturnedCalculatedData> {
		try {
			return await this.gamesService.setResultData(params.id, body, headers.token);
		}
		catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.WRONG_GAME_ID)) {
				throw new NotFoundException(errorMessage);
			}
			else if (errorMessage.includes(ErrorMessages.WRONG_QUESTION_DATA)) {
				throw new BadRequestException(errorMessage);
			}
			throw new InternalServerErrorException();
		}
	}

	@Get(":id/results")
	async getGameResultsByGameId (
		@Param() params: DtoIdParams,
		@Headers() headers: IHeader
	) {
		try {
			return await this.gamesService.getUserResults({
				game: params.id,
				user: headers.token,
			});
		}
		catch (e) {
			const errorMessage = String(e.message);
			if (errorMessage.includes(ErrorMessages.CANNOT_FIND_RESULTS)) {
				throw new NotFoundException(errorMessage);
			}
			console.log(errorMessage);
			throw new InternalServerErrorException();
		}
	}
	
}
