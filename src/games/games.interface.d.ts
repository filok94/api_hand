import { PersonDocument } from "./schemas/person.schema";
import mongoose from "mongoose";
import { Person } from "./schemas/game.schema";
export interface IReturnedOneQuestion {
	question: string;
	answers: string[];
	index: number;
}

export interface IReturnedCalculatedResult {
	right_answer: number;
	user_answer: number;
	is_right: boolean;
	index: number;
}

export interface IReturnedCalculatedData {
	person: Person;
	test_result: IReturnedCalculatedResult[];
}

export interface ILinkResultToDB {
	game: mongoose.Schema.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
	right_answers_count: number;
	person: mongoose.Schema.Types.ObjectId;
	test_data: IReturnedCalculatedResult[];
}

export interface IGetUserGameResult {
	game: mongoose.Schema.Types.ObjectId;
	user: string;
}

export interface IReturnedGameResults {
	game_id: mongoose.Schema.Types.ObjectId;
	game_title: string;
	test_data: UserGametestDataDocument;
	person: PersonDocument;
}

export interface IReturnedBriefGames {
	_id: mongoose.Schema.Types.ObjectId;
	title: string;
	description: string;
	persons: mongoose.Schema.Types.ObjectId[];
	link: string;
}
