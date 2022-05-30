import { IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export default class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: mongoose.Schema.Types.ObjectId;
}
