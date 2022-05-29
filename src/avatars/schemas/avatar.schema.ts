import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

export type AvatarDocument = Avatar & Document;

@Schema({
  versionKey: false,
})
export class Avatar {
  @Prop({
    type: String,
    maxLength: 100,
    required: true,
    unique: true,
  })
  ref_name: string;

  @Prop({
    type: String,
    maxLength: 255,
    required: true,
    unique: true,
  })
  base_link: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "avatarprops",
  })
  props: mongoose.Schema.Types.ObjectId[];
}
export const AvatarSchema = SchemaFactory.createForClass(Avatar);

export type AvatarPropsDocument = AvatarProps & Document;
@Schema({
  versionKey: false,
})
export class AvatarProps {
  @Prop({
    type: String,
    required: true,
  })
  prop_name: string;

  @Prop({
    type: [String],
    required: true,
  })
  values: string[];
}
export const AvatarPropsSchema = SchemaFactory.createForClass(AvatarProps);
