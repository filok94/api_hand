import { UserGames, UserGamesDocument } from "./schemas/user_games.schema";
import {
	IGetUserGameResult,
	ILinkResultToDB,
	IReturnedBriefGames,
	IReturnedCalculatedData,
	IReturnedCalculatedResult,
	IReturnedGameResults,
} from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/calculate.dto";
import { ErrorMessages } from "./../exceptions/exceptions";
import { DtoCreateGame } from "./dto/create_game.dto";
import { Game, GameDocument, TestData } from "./schemas/game.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { DtoGameIdQuery } from "./dto/queries.dto";
import { TokenService } from "../auth/token.service";
import { Person, PersonDocument } from "./schemas/person.schema";

@Injectable()
export class GamesService {
	constructor(
		@InjectModel(Game.name) private gameModel: Model<GameDocument>,
		@InjectModel(Person.name) private personModel: Model<PersonDocument>,
		@InjectModel(UserGames.name)
		private userGamesModel: Model<UserGamesDocument>,
		private tokenService: TokenService
	) {}

	async getAllGames(): Promise<IReturnedBriefGames[]> {
		try {
			return (await this.gameModel.find()).map((e) => {
				return {
					title: e.title,
					description: e.description,
					link: e.link,
					_id: e._id,
					persons: e.persons,
				};
			});
		} catch (e) {
			throw new Error(e);
		}
	}

	async adminGetGameById(id: mongoose.Schema.Types.ObjectId): Promise<{
		game: GameDocument;
	}> {
		try {
			const game = await this.gameModel.findById(id);
			return { game };
		} catch (e) {
			throw new Error(ErrorMessages.NOT_FOUND);
		}
	}

	async adminCreateGame(
		dto: DtoCreateGame
	): Promise<mongoose.Schema.Types.ObjectId> {
		try {
			const personsInDb = await this.personModel.find({
				id: { $in: [dto.persons] },
			});

			if (personsInDb.length === dto.persons.length) {
				const newGame = await this.gameModel.create(dto);

				return newGame._id;
			} else {
				throw new Error(ErrorMessages.PERSON_NOT_FOUND);
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	async getQuestionsForGame(
		param: DtoGameIdQuery
	): Promise<IReturnedOneQuestion[]> {
		try {
			const gameData = await this.gameModel.findOne({
				game: param.game_id,
			});
			const returnedArray: IReturnedOneQuestion[] = gameData.test_data.map(
				(e) => {
					return {
						question: e.question,
						answers: e.answers,
						index: e.index,
					};
				}
			);
			return returnedArray;
		} catch (e) {
			throw new Error(e);
		}
	}

	private async calculateResult(
		dto: DtoCalculate,
		testData: TestData[]
	): Promise<IReturnedCalculatedResult[]> {
		try {
			const answersAndResults: IReturnedCalculatedResult[] = [];
			dto.answers.forEach((e) => {
				const answerObject = testData.find(
					(dbElement) => dbElement.index === e.index
				);

				const isRight = e.answer === answerObject.right_answer;
				answersAndResults.push({
					right_answer: answerObject.right_answer,
					user_answer: e.answer,
					is_right: isRight,
					index: e.index,
				});
			});

			return answersAndResults;
		} catch (e) {
			throw new Error(e);
		}
	}

	async setResultData(
		dto: DtoCalculate,
		userToken: string
	): Promise<IReturnedCalculatedData> {
		try {
			const gameDbInfo = await this.gameModel
				.findById(dto.game_id)
				.populate<{ persons: PersonDocument[] }>({
					path: "persons",
					model: this.personModel,
				})
				.exec();

			//error handling
			if (!gameDbInfo) {
				throw new Error(ErrorMessages.WRONG_GAME_ID);
			}
			const gameIndexesCheckDb = gameDbInfo.test_data.map((e) => e.index);
			const gameIndexesCheckDbSet = new Set(gameIndexesCheckDb);
			const gameIndexesCheckDto = dto.answers.map((e) => e.index);
			const gameIndexesCheckDtoSet = new Set(gameIndexesCheckDto);
			const isIndexesRight =
				gameIndexesCheckDb.length == gameIndexesCheckDto.length &&
				gameIndexesCheckDto.filter((e) => !gameIndexesCheckDb.includes(e))
					.length == 0;
			if (
				!isIndexesRight ||
				gameIndexesCheckDbSet.size !== gameIndexesCheckDtoSet.size
			) {
				throw new Error(ErrorMessages.WRONG_QUESTION_DATA);
			}
			// set results
			const test_result = await this.calculateResult(dto, gameDbInfo.test_data);
			const countOfRightAnswers = test_result.filter((e) => e.is_right).length;
			const person = gameDbInfo.persons.find(
				(e) => e.count === countOfRightAnswers
			);
			const user = await this.tokenService.getUserByToken(userToken);
			await this.linkResultToUser({
				right_answers_count: countOfRightAnswers,
				person: person._id,
				game: dto.game_id,
				user: user.id,
				test_data: test_result,
			});
			return {
				person,
				test_result,
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	private async linkResultToUser(
		dataToSave: ILinkResultToDB
	): Promise<mongoose.Schema.Types.ObjectId> {
		try {
			const newData = await this.userGamesModel.findOneAndUpdate(
				{
					game: dataToSave.game,
					user: dataToSave.user,
				},
				{
					game: dataToSave.game,
					user: dataToSave.user,
					right_answers_count: dataToSave.right_answers_count,
					person: dataToSave.person,
					test_data: dataToSave.test_data,
				},
				{ upsert: true, new: true }
			);
			return newData.id;
		} catch (e) {
			throw new Error(e);
		}
	}

	async getUserResults(
		data: IGetUserGameResult
	): Promise<IReturnedGameResults> {
		try {
			const user = await this.tokenService.getUserByToken(data.user);
			const gameData = await this.userGamesModel
				.findOne({
					game: data.game,
					user,
				})
				.populate<{ person: PersonDocument }>({
					path: "person",
					model: this.personModel,
				})
				.populate<{ game: GameDocument }>({
					path: "game",
					model: this.gameModel,
				})
				.exec();
			return {
				game_title: gameData.game.title,
				game_id: gameData._id,
				person: gameData.person,
				test_data: gameData.test_data,
			};
		} catch (e) {
			throw new Error(e);
		}
	}
}
