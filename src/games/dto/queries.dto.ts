import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class DtoIdParams {
	@IsNotEmpty()
	@IsMongoId({
		message: ({ property }) => `${property} is incorrect id`,
	})
	readonly id: mongoose.Schema.Types.ObjectId;
}

