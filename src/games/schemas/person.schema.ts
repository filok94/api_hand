import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PersonDocument = Person & Document;

@Schema({ collection: "persons", versionKey: false })
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
