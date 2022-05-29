import mongoose from "mongoose";
import { IReturnedCalculatedData } from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/is_right.dto";
import { ErrorMessages, ExcepitonsStrings } from "../exceptions/exceptions";
import { PersonService } from "./person.service";
import { DtoCreateGame } from "./dto/create_game.dto";
import { GamesService } from "./games.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Headers,
  Put,
} from "@nestjs/common";
import { DtoCreatePerson } from "./dto/create_person.dto";
import { AuthGuard } from "@nestjs/passport";
import { DtoGetQuestionsQuery, IQueryGetGame } from "./dto/queries.dto";
import { IHeader } from "src/common/common_interfaces";

@UseGuards(AuthGuard())
@Controller("games")
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private personService: PersonService
  ) {}

  @Get("get_all")
  async getAllGames() {
    try {
      return await this.gamesService.getAllGames();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Post("create")
  async createGame(@Body() dto: DtoCreateGame) {
    try {
      return await this.gamesService.createGame(dto);
    } catch (e) {
      console.log(e.message);
      if (String(e.message).includes("E11000")) {
        // throw new BadRequestException({}).getResponse();
        throw new HttpException(
          `one of persons ${ErrorMessages.DUPLICATES}`,
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
      const deletedCount = await this.gamesService.deleteAllGames();
      return { deleted: deletedCount };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Delete("person/delete_all")
  async deleteAllPersons() {
    try {
      const deletedCount = await this.personService.deleteAllPersons();
      return { deleted: deletedCount };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Post("person/create")
  async createNewPerson(@Body() dto: DtoCreatePerson) {
    try {
      const personId = await this.personService.createOnePerson(dto);
      return { person_id: personId };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Get("person/get_all")
  async getAllPersons() {
    try {
      return await this.personService.getAllPersons();
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException().getResponse();
    }
  }

  @Get("get")
  async getGameById(@Query() query: IQueryGetGame) {
    try {
      return await this.gamesService.getGameById(query.id);
    } catch (e) {
      if (String(e.message).includes(ErrorMessages.NOT_FOUND)) {
        throw new HttpException(
          ErrorMessages.NOT_FOUND,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new InternalServerErrorException().getResponse();
      }
    }
  }

  @Get("get_questions")
  async getQuestionWithAnswers(
    @Query() params: DtoGetQuestionsQuery
  ): Promise<IReturnedOneQuestion[]> {
    try {
      return await this.gamesService.getQuestionsForGame(params);
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);
      if (
        errorMessage.includes(ExcepitonsStrings.CAST_ERROR) ||
        errorMessage.includes(ExcepitonsStrings.CANNOT_READ_NULL)
      ) {
        throw new HttpException(
          ErrorMessages.NOT_FOUND,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Put("calculate")
  async isAnswerRight(
    @Body() body: DtoCalculate,
    @Headers() headers: IHeader
  ): Promise<IReturnedCalculatedData> {
    try {
      return await this.gamesService.getResultData(body, headers.token);
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);
      if (errorMessage.includes(ExcepitonsStrings.CAST_ERROR)) {
        throw new HttpException(
          ErrorMessages.NOT_FOUND,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Get("get_results")
  async getGameResultsByGameId(
    @Query() query: DtoGetQuestionsQuery,
    @Headers() headers: IHeader
  ) {
    try {
      return await this.gamesService.getUserResults({
        game: query.game_id,
        user: headers.token,
      });
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);

      if (
        errorMessage.includes(ExcepitonsStrings.CANNOT_READ_NULL) ||
        errorMessage.includes(ExcepitonsStrings.CAST_ERROR)
      ) {
        throw new BadRequestException().getResponse();
      }
      throw new InternalServerErrorException().getResponse();
    }
  }
}

// клиент запрашивает айдишки всех вопросов по игре (фильтр по айди игры)
// затем делает запрос по конкретному индексу - получает вопрос и варианты ответов по индексу, не получая номер правильного ответа
// затем делает запрос с выбранным вариантом и получает true/false
// затем в бд записывается прохождение в user_games и клиент может запросить персону, до этого permission denied
