import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({
  versionKey: false
})
export class Token {
  @Prop({
    required: true,
    unique: true,
    type: String,
    minlength: 150,
    maxlength: 255
  })
    refresh_token: string

  @Prop({
    required: true,
    unique: true,
    type: String,
    minlength: 150,
    maxlength: 255
  })
    access_token: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
export type TokenDocument = Token & Document;
