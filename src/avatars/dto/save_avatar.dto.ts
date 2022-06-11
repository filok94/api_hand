import mongoose from "mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { IsIdExistsAndCorrect } from "src/validators/id_validator";
import { ValidateLink } from "../validators/validate_link";

export class DtoSaveAvatar {
  @IsNotEmpty()
  @IsString()
  @ValidateLink()
  full_link: string;

  @IsNotEmpty()
  @IsString()
  @IsIdExistsAndCorrect("avatar")
  avatar: mongoose.Schema.Types.ObjectId;
}
