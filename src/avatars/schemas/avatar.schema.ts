import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

@Schema({
  versionKey: false,
  _id: false,
  autoCreate: false,
  id: false
})
export class AvatarProps {
	@Prop({
	  type: String,
	  required: true
	})
	  prop_name: string

	@Prop({
	  type: [String],
	  required: true
	})
	  values: string[]

	@Prop({
	  type: String
	})
	  probability: string | null
}
export const AvatarPropsSchema = SchemaFactory.createForClass(AvatarProps)

@Schema({
  versionKey: false
})
export class Avatar {
	@Prop({
	  type: String,
	  maxLength: 100,
	  required: true,
	  unique: true
	})
	  ref_name: string

	@Prop({
	  type: String,
	  maxLength: 255,
	  required: true,
	  unique: true
	})
	  base_link: string

	@Prop({
	  type: [AvatarPropsSchema],
	  required: true
	})
	  props: AvatarProps[]
}
export const AvatarSchema = SchemaFactory.createForClass(Avatar)

@Schema({ versionKey: false, _id: false, id: false })
export class UserAvatar {
	@Prop({
	  type: String,
	  required: true
	})
	  full_link: string

	@Prop({
	  required: true,
	  type: mongoose.Schema.Types.ObjectId,
	  unique: true,
	  ref: 'users'
	})
	  user: mongoose.Schema.Types.ObjectId

	@Prop({
	  required: true,
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'avatars'
	})
	  avatar: mongoose.Schema.Types.ObjectId
}
export const UserAvatarSchema = SchemaFactory.createForClass(UserAvatar)
export type AvatarDocument = Avatar & Document;
export type AvatarPropsDocument = AvatarProps & Document;
export type UserAvatarDocument = UserAvatar & Document;
