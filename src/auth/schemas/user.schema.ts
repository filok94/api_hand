import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Token } from './token.schema'

@Schema({
  versionKey: false
})
export class User {
	@Prop({
	  required: true,
	  immutable: true,
	  unique: true,
	  minlength: 6,
	  maxlength: 20
	})
	  login: string

	@Prop({
	  required: true, minlength: 8, maxlength: 255
	})
	  password: string

	@Prop({
	  type: Boolean, required: true, default: false
	})
	  is_admin: boolean

	@Prop({
	  type: Array, required: false
	})
	  tokens: Token[]
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocument = User & Document;
