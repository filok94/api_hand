import {
  IReturnedCalculatedData,
  IReturnedCalculatedResult,
} from './games.interface.d';
import { IReturnedOneQuestion } from './games.interface';
import { DtoCalculate } from './dto/is_right.dto';
import { ErrorMessages } from './../exceptions/exceptions';

import { DtoCreateGame } from './dto/create_game.dto';
import {
  Game,
  GameDocument,
  Person,
  PersonDocument,
  TestData,
  TestDataDocument,
} from './schemas/game.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { DtoGetQuestionsQuery } from './dto/queries.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
    @InjectModel(TestData.name) private testDataModel: Model<TestDataDocument>,
  ) {}

  async getAllGames(): Promise<Game[]> {
    try {
      return await this.gameModel.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  async getGameById(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<{ game: Game; question_block: TestData[] }> {
    try {
      const game = await this.gameModel.findById(id);
      const data = await this.testDataModel.find({ game: id });
      return { game, question_block: data };
    } catch (e) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
  }

  async createGame(
    dto: DtoCreateGame,
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      let foundCount = 0;
      for (const person of dto.persons) {
        const isPersonExist = await this.personModel.find({ _id: person });
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
        throw new Error();
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAllGames(): Promise<number> {
    try {
      await this.testDataModel.deleteMany();
      return (await this.gameModel.deleteMany()).deletedCount;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getQuestionsForGame(
    param: DtoGetQuestionsQuery,
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

  async calculateResult(
    dto: DtoCalculate,
  ): Promise<IReturnedCalculatedResult[]> {
    try {
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
        });
      }

      return answersAndResults;
    } catch (e) {
      throw new Error(e);
    }
  }

  async calculatePerson(
    count: number,
    persons: mongoose.Schema.Types.ObjectId[],
  ): Promise<Person> {
    try {
      console.log(count, persons);

      return await this.personModel.findOne({
        count: count,
        _id: { $in: persons },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getResultData(dto: DtoCalculate): Promise<IReturnedCalculatedData> {
    const calculatedResult = await this.calculateResult(dto);
    const countOfRightAnswers = calculatedResult.filter(
      (e) => e.is_right,
    ).length;
    const gamePersons = (await this.gameModel.findById(dto.game_id)).persons;
    const person = await this.calculatePerson(countOfRightAnswers, gamePersons);
    return {
      person: person,
      test_result: calculatedResult,
    };
  }
}
