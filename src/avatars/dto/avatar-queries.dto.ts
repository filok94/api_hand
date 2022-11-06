import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class DtoAvatarIdQuery {
	@IsNotEmpty()
	@IsMongoId({
		message: ({ property }) => `${property} is incorrect id`,
	})
	readonly avatar_id: mongoose.Schema.Types.ObjectId;
}
