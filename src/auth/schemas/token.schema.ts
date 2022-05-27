import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type TokenDocument = Token & Document;
@Schema()
export class Token {
  @Prop({
    required: true,
    immutable: true,
    unique: true,
    type: String,
    minlength: 150,
    maxlength: 255,
  })
  refresh_token: string;

  @Prop({
    required: true,
    immutable: true,
    unique: true,
    type: String,
    minlength: 150,
    maxlength: 255,
  })
  access_token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user?: mongoose.Schema.Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
