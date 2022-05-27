import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class DtoCalculate {
  @IsNotEmpty()
  @IsString()
  readonly game_id: mongoose.Schema.Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => DtoCalculateAnswers)
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  readonly answers: DtoCalculateAnswers[];
}

export class DtoCalculateAnswers {
  @IsNotEmpty()
  @IsNumber()
  readonly index: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(3)
  readonly answer: number;
}
