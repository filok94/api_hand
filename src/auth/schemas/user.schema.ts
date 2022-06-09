import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, immutable: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Boolean, required: true, default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
