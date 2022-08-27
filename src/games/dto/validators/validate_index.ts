import mongoose from "mongoose";
import { GamesService } from "../../games.service";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { DtoCalculateAnswers } from "../calculate.dto";

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateIndexesConstraint implements ValidatorConstraintInterface {
  constructor(private gameService: GamesService) {}
  #returnMessage = "cannot check answers for unknown id";
  #neededSize = 0;
  #givenSize = 0;
  async validate(dto: DtoCalculateAnswers[], args: ValidationArguments) {
    try {
      //проверка, что id валидно
      const gameId = args.object["game_id"] as mongoose.Schema.Types.ObjectId;
      if (!mongoose.Types.ObjectId.isValid(String(gameId))) {
        this.#returnMessage = "cannot read answers for incorrect id";
        return false;
      }

      const gameDataIndexes = new Set(
        (await this.gameService.adminGetGameById(gameId)).question_block.map(
          (e) => e.index
        )
      );
      const dtoIndexes = new Set(dto.map((e) => e.index));
      this.#neededSize = gameDataIndexes.size;
      this.#givenSize = dtoIndexes.size;

      //проверка, что по этому id есть данные
      if (gameDataIndexes.size === 0) {
        return false;
      }

      //Проверка, что индексы не дублируются
      if (dto.length !== this.#givenSize) {
        this.#returnMessage = "indexes duplicate";
        return false;
      }

      //Проверка, что индексы внутри допустимого значения
      const diff = [...dtoIndexes].filter(
        (x) => ![...gameDataIndexes].includes(x)
      );
      if (diff.length > 0) {
        this.#returnMessage = `indexes [${diff}] are out of range: [0-${
          this.#neededSize - 1
        }]`;
        return false;
      }

      // Проверка, что даны все индексы
      if (this.#neededSize !== this.#givenSize) {
        this.#returnMessage = `Should be ${
          this.#neededSize
        } unique answers, given ${this.#givenSize}`;
      }
      this.#returnMessage = "cannot find indexes for unknown id";
      return true;
    } catch (e) {}
  }
  defaultMessage(): string {
    return this.#returnMessage;
  }
}

export function ValidateIndexes(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateIndexesConstraint,
    });
  };
}
