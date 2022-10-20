import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

export type GameDocument = Game & Document;
export const maxAnswersCount = 4;

@Schema({
	versionKey: false,
	_id: false,
	autoCreate: false,
})
export class TestData {
	@Prop({
		required: true,
		type: Number,
		max: 10,
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
		maxlength: maxAnswersCount,
	})
	answers: string[];

	@Prop({
		required: true,
		type: Number,
		max: maxAnswersCount - 1,
	})
	right_answer: number;
}

export const TestDataSchema = SchemaFactory.createForClass(TestData);

@Schema({
	versionKey: false,
})
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
		ref: "persons",
	})
	persons: mongoose.Schema.Types.ObjectId[];

	@Prop({
		required: true,
		type: [TestDataSchema],
	})
	test_data: TestData[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
