import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({
  collection: 'persons', versionKey: false
})
export class Person {
  @Prop({
    required: true,
    maxlength: 50,
    type: String
  }) name: string

  @Prop({
    required: true,
    maxlength: 250,
    type: String
  })
    description: string

  @Prop({
    required: true,
    maxlength: 350,
    type: String
  })
    link: string

  @Prop({
    required: true,
    isInteger: true,
    type: Number
  })
    count: number
}

export type PersonDocument = Person & Document;
export const PersonSchema = SchemaFactory.createForClass(Person)
