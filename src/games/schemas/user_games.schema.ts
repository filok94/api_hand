import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { IReturnedCalculatedResult } from '../games.interface'

export const maxAnswersCount = 4

@Schema({
  _id: false,
  versionKey: false
})
export class UserGamesTestData extends Document {
  @Prop({
    type: Number,
    required: true,
    max: maxAnswersCount
  })
    right_answer: number

  @Prop({
    type: Number,
    required: true,
    max: maxAnswersCount
  })
    user_answer: number

  @Prop({ type: Boolean, required: true })
    is_right: boolean

  @Prop({ type: Number, required: true })
    index: number
}

export type UserGametestDataDocument = UserGamesTestData & Document;
export const UserGamesTestDataSchema =
  SchemaFactory.createForClass(UserGamesTestData)

@Schema({
  versionKey: false
})
export class UserGames extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  })
    user?: mongoose.Schema.Types.ObjectId

  @Prop({
    type: Number,
    required: true
  })
    right_asnwers_count: number

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'games'
  })
    game: mongoose.Schema.Types.ObjectId

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'persons'
  })
    person: mongoose.Schema.Types.ObjectId

  @Prop({ type: [UserGamesTestDataSchema], required: true })
    test_data: IReturnedCalculatedResult[]
}
export type UserGamesDocument = UserGames & Document;
export const UserGamesSchema = SchemaFactory.createForClass(UserGames)
