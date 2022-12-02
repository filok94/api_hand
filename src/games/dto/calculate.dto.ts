import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	Max,
	Min,
	ValidateNested,
} from "class-validator";

export class DtoCalculate {

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
