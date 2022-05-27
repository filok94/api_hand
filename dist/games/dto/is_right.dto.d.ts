import mongoose from 'mongoose';
export declare class DtoCalculate {
    readonly game_id: mongoose.Schema.Types.ObjectId;
    readonly answers: DtoCalculateAnswers[];
}
export declare class DtoCalculateAnswers {
    readonly index: number;
    readonly answer: number;
}
