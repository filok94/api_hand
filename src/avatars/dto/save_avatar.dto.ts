import mongoose from "mongoose";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class DtoSaveAvatar {
	@IsNotEmpty()
	@IsString()
	full_link: string;

	@IsNotEmpty()
	@IsString()
	@IsMongoId({
		message: ({ property }) => `${property} is incorrect id`,
	})
	avatar: mongoose.Schema.Types.ObjectId;
}
