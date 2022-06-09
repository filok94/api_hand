import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { IsIdExistsAndCorrect } from "./validators/validate_game_id";

export class DtoGameIdQuery {
  @IsNotEmpty()
  @IsIdExistsAndCorrect("game")
  readonly game_id: mongoose.Schema.Types.ObjectId;
}

export class DtoPersonIdQuery {
  @IsNotEmpty()
  @IsIdExistsAndCorrect("person")
  readonly id: mongoose.Schema.Types.ObjectId;
}
