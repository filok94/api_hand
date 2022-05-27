import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({
    required: true,
    maxlength: 50,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    maxlength: 255,
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    type: String,
  })
  link: string;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Person',
  })
  persons: mongoose.Schema.Types.ObjectId[];
}

export const GameSchema = SchemaFactory.createForClass(Game);

export type PersonDocument = Person & Document;
@Schema()
export class Person {
  @Prop({
    required: true,
    maxlength: 50,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    maxlength: 150,
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    maxlength: 150,
    type: String,
  })
  link: string;

  @Prop({
    required: true,
    isInteger: true,
    type: Number,
  })
  count: number;
}

export const PersonSchema = SchemaFactory.createForClass(Person);

export type TestDataDocument = TestData & Document;
@Schema()
export class TestData {
  @Prop({
    required: true,
    type: Number,
    max: 15,
  })
  index: number;

  @Prop({
    required: true,
    maxlength: 300,
    type: String,
  })
  question: string;

  @Prop({
    required: true,
    type: [String],
  })
  answers: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  })
  game: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    validate: {
      validator: function (v) {
        this.answers.length <= v;
      },
    },
  })
  right_answer: number;
}

export const TestDataSchema = SchemaFactory.createForClass(TestData);
