import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { IsIdExistsAndCorrect } from "../../validators/id_validator";
export class DtoAvatarIdQuery {
  @IsNotEmpty()
  @IsIdExistsAndCorrect("avatar")
  readonly avatar_id: mongoose.Schema.Types.ObjectId;
}
