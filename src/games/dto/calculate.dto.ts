import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
	ValidateNested,
} from "class-validator";
import mongoose from "mongoose";
import { IsIdExistsAndCorrect } from "../../validators/id_validator";

export class DtoCalculate {
	@IsNotEmpty()
	@IsString()
	@IsIdExistsAndCorrect("game")
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
	@Min(0)
	readonly index: number;

	@IsNotEmpty()
	@IsNumber()
	@Max(3)
	@Min(0)
	readonly answer: number;
}
