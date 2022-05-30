import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

export class DtoCreateGame {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @ValidateNested({ each: true })
  @Type(() => DtoQuestionBlock)
  @IsArray()
  @IsNotEmpty()
  readonly question_block: DtoQuestionBlock[];

  @IsNotEmpty()
  @IsArray()
  readonly persons: mongoose.Schema.Types.ObjectId[];
}

export class DtoQuestionBlock {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @IsNotEmpty()
  answers: string[];

  @IsNumber()
  @Min(0, {
    message: "value should be 0-3",
  })
  @Max(3, {
    message: "value should be 0-3",
  })
  right_answer: number;

  @IsNotEmpty()
  @IsNumber()
  readonly index: number;
}
