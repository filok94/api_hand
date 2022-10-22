import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { IsIdCorrect } from "../../validators/id_validator";
export class DtoAvatarIdQuery {
	@IsNotEmpty()
	@IsIdCorrect("avatar")
	readonly avatar_id: mongoose.Schema.Types.ObjectId;
}
