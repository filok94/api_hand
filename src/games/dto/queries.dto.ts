import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { IsIdCorrect } from "../../validators/id_validator";

export class DtoGameIdQuery {
	@IsNotEmpty()
	@IsIdCorrect("game")
	readonly game_id: mongoose.Schema.Types.ObjectId;
}

export class DtoPersonIdQuery {
	@IsNotEmpty()
	@IsIdCorrect("person")
	readonly id: mongoose.Schema.Types.ObjectId;
}
