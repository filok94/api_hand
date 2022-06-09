import { PersonService } from "./person.service";
import { UserGames, UserGamesDocument } from "./schemas/user_games.schema";
import {
  IGetUserGameResult,
  ILinkResultToDB,
  IReturnedCalculatedData,
  IReturnedCalculatedResult,
  IReturnedGameResults,
} from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/calculate.dto";
import { ErrorMessages } from "./../exceptions/exceptions";
import { DtoCreateGame } from "./dto/create_game.dto";
import {
  Game,
  GameDocument,
  TestData,
  TestDataDocument,
} from "./schemas/game.schema";
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
    @InjectModel(TestData.name) private testDataModel: Model<TestDataDocument>,
    @InjectModel(UserGames.name)
    private userGamesModel: Model<UserGamesDocument>,
    private tokenService: TokenService,
    private personService: PersonService
  ) {}

  async getAllGames(): Promise<Game[]> {
    try {
      return await this.gameModel.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  async adminGetGameById(id: mongoose.Schema.Types.ObjectId): Promise<{
    game: GameDocument;
    question_block: TestData[];
  }> {
    try {
      const game = await this.gameModel.findById(id);
      const data = await this.testDataModel.find({ game: id });
      return { game, question_block: data };
    } catch (e) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
  }

  async adminCreateGame(
    dto: DtoCreateGame
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      let foundCount = 0;
      for (const person of dto.persons) {
        const isPersonExist = await this.personModel.findOne({ _id: person });
        isPersonExist ? foundCount++ : null;
      }

      if (foundCount === dto.persons.length) {
        const newGame = await this.gameModel.create(dto);
        for (const question of dto.question_block) {
          await this.testDataModel.create({
            game: newGame._id,
            ...question,
          });
        }
        const game_data = await this.gameModel.findById(newGame.id);
        return game_data._id;
      } else {
        throw new Error(ErrorMessages.PERSON_NOT_FOUND);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async adminDeleteAllGames(): Promise<number> {
    try {
      await this.testDataModel.deleteMany();
      return (await this.gameModel.deleteMany()).deletedCount;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getQuestionsForGame(
    param: DtoGameIdQuery
  ): Promise<IReturnedOneQuestion[]> {
    try {
      const gameData = await this.testDataModel.find({
        game: param.game_id,
      });
      const returnedArray: IReturnedOneQuestion[] | never[] = [];
      for (const game of gameData) {
        returnedArray.push({
          question: game.question,
          answers: game.answers,
          index: game.index,
        });
      }
      return returnedArray;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async calculateResult(
    dto: DtoCalculate
  ): Promise<IReturnedCalculatedResult[]> {
    try {
      const questionsInDb = await this.testDataModel.find({
        game: dto.game_id,
      });
      if (questionsInDb.length === 0) {
        throw new Error(ErrorMessages.CANNOT_FIND_GAME);
      }
      const lengthCheck = questionsInDb.length == dto.answers.length;
      if (lengthCheck) {
        const answersAndResults: IReturnedCalculatedResult[] = [];
        for (const answer of dto.answers) {
          const questionData = await this.testDataModel.findOne({
            game: dto.game_id,
            index: answer.index,
          });
          const isRight = questionData.right_answer == answer.answer;
          answersAndResults.push({
            right_answer: questionData.right_answer,
            user_answer: answer.answer,
            is_right: isRight,
            index: answer.index,
          });
        }

        return answersAndResults;
      } else {
        throw new Error(
          `answers ${ErrorMessages.LENGTH_IS_BAD}. Should be ${questionsInDb.length}`
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async getResultData(
    dto: DtoCalculate,
    userToken: string
  ): Promise<IReturnedCalculatedData> {
    try {
      const test_result = await this.calculateResult(dto);
      const countOfRightAnswers = test_result.filter((e) => e.is_right).length;
      const gamePersons = (await this.gameModel.findById(dto.game_id)).persons;
      const person = await this.personService.calculatePerson(
        countOfRightAnswers,
        gamePersons
      );
      const user = await this.tokenService.getUserByToken(userToken);
      await this.linkResultToUser({
        right_answers_count: countOfRightAnswers,
        person: person._id,
        game: dto.game_id,
        user: user,
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
      const gameData = await this.userGamesModel.findOne({
        game: data.game,
        user,
      });
      const game = await this.gameModel.findById(data.game);
      return {
        game_title: game.title,
        game_id: gameData._id,
        person_id: gameData.person,
        test_data: gameData.test_data,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
