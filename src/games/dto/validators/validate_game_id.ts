import { PersonService } from "./../../person.service";
import mongoose from "mongoose";
import { GamesService } from "./../../games.service";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
type GameAndPerson = "game" | "person";
@ValidatorConstraint({ async: true })
@Injectable()
export class IsIdExistsAndCorrectConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    private gameService: GamesService,
    private personService: PersonService
  ) {}
  returnMessage = "";
  async validate(
    id: mongoose.Schema.Types.ObjectId,
    args: ValidationArguments
  ) {
    //проверка корректности айди
    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      this.returnMessage = "id is incorrect";
      return false;
    }

    //проверка существует ли такой айди в базе (персон или игр)
    const [idType] = args.constraints as GameAndPerson[];
    switch (idType) {
      case "game":
        const idGame = await this.gameService.adminGetGameById(id);
        if (idGame.game == null) {
          this.returnMessage = `cannot find game with this id`;
          return false;
        }
        break;
      case "person":
        const personId = await this.personService.getPersonById(id);
        if (personId == null) {
          this.returnMessage = `cannot find person with this id`;
          return false;
        }
        break;
      default:
        return true;
    }

    //если ни одна из проверок не выдала ошибки, то возвращаем true
    return true;
  }
  defaultMessage(): string {
    return this.returnMessage;
  }
}

export function IsIdExistsAndCorrect(
  property: GameAndPerson,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsIdExistsAndCorrectConstraint,
    });
  };
}
