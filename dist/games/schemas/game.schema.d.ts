import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare type GameDocument = Game & Document;
export declare class Game {
    title: string;
    description: string;
    link: string;
    persons: mongoose.Schema.Types.ObjectId[];
}
export declare const GameSchema: mongoose.Schema<mongoose.Document<Game, any, any>, mongoose.Model<mongoose.Document<Game, any, any>, any, any, any>, {}, {}>;
export declare type PersonDocument = Person & Document;
export declare class Person {
    name: string;
    description: string;
    link: string;
    count: number;
}
export declare const PersonSchema: mongoose.Schema<mongoose.Document<Person, any, any>, mongoose.Model<mongoose.Document<Person, any, any>, any, any, any>, {}, {}>;
export declare type TestDataDocument = TestData & Document;
export declare class TestData {
    index: number;
    question: string;
    answers: string[];
    game: mongoose.Schema.Types.ObjectId;
    right_answer: number;
}
export declare const TestDataSchema: mongoose.Schema<mongoose.Document<TestData, any, any>, mongoose.Model<mongoose.Document<TestData, any, any>, any, any, any>, {}, {}>;
