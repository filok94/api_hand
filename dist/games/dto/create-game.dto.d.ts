export declare class CreateGameDto {
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly question_block: QuestionBlock[];
}
export declare class QuestionBlock {
    question: string;
    answers: string[];
    right_answer: number;
}
