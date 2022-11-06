import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class DtoGameIdQuery {
	@IsNotEmpty()
	@IsMongoId({
		message: ({ property }) => `${property} is incorrect id`,
	})
	readonly game_id: mongoose.Schema.Types.ObjectId;
}

export class DtoPersonIdQuery {
	@IsNotEmpty()
	@IsMongoId({
		message: ({ property }) => `${property} is incorrect id`,
	})
	readonly id: mongoose.Schema.Types.ObjectId;
}
