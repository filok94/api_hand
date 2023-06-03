import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import mongoose from 'mongoose'

export class DtoIdParams {
	@IsNotEmpty()
	@IsMongoId({
	  message: ({ property, value }) => `${value} is incorrect ${property} type`
	})
  readonly id: mongoose.Schema.Types.ObjectId
}

export class DtoTitleBody {
	@IsNotEmpty()
	@IsString()
  readonly title: string
}
