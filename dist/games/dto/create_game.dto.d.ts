import mongoose from 'mongoose';
export declare class DtoCreateGame {
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly question_block: DtoQuestionBlock[];
    readonly persons: mongoose.Schema.Types.ObjectId[];
}
export declare class DtoQuestionBlock {
    question: string;
    answers: string[];
    right_answer: number;
    readonly index: number;
}
