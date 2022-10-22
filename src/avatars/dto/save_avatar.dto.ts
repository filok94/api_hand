import mongoose from "mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { IsIdCorrect } from "src/validators/id_validator";

export class DtoSaveAvatar {
	@IsNotEmpty()
	@IsString()
	full_link: string;

	@IsNotEmpty()
	@IsString()
	@IsIdCorrect("avatar")
	avatar: mongoose.Schema.Types.ObjectId;
}
