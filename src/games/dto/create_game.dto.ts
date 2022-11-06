import { Type } from "class-transformer";
import {
	IsArray,
	IsMongoId,
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
	readonly test_data: DtoQuestionBlock[];

	@IsNotEmpty()
	@IsArray()
	@IsMongoId({
		message: ({ property }) => `one of ${property} is incorrect id`,
		each: true,
	})
	readonly persons: mongoose.Schema.Types.ObjectId[];
}

export class DtoQuestionBlock {
	@IsNotEmpty()
	@IsString()
	readonly question: string;

	@IsArray()
	@IsNotEmpty()
	readonly answers: string[];

	@IsNumber()
	@Min(0, {
		message: ({ constraints, property, value }) =>
			`${property} ${value} should be more or equal to ${constraints}`,
	})
	@Max(3, {
		message: ({ constraints, property, value }) =>
			`${property} ${value} should be less or equal to ${constraints}`,
	})
	readonly right_answer: number;

	@IsNotEmpty()
	@IsNumber()
	readonly index: number;
}
