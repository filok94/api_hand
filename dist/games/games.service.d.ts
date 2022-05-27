import { IReturnedCalculatedData, IReturnedCalculatedResult } from './games.interface.d';
import { IReturnedOneQuestion } from './games.interface';
import { DtoCalculate } from './dto/is_right.dto';
import { DtoCreateGame } from './dto/create_game.dto';
import { Game, GameDocument, Person, PersonDocument, TestData, TestDataDocument } from './schemas/game.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { DtoGetQuestionsQuery } from './dto/queries.dto';
export declare class GamesService {
    private gameModel;
    private personModel;
    private testDataModel;
    constructor(gameModel: Model<GameDocument>, personModel: Model<PersonDocument>, testDataModel: Model<TestDataDocument>);
    getAllGames(): Promise<Game[]>;
    getGameById(id: mongoose.Schema.Types.ObjectId): Promise<{
        game: Game;
        question_block: TestData[];
    }>;
    createGame(dto: DtoCreateGame): Promise<mongoose.Schema.Types.ObjectId>;
    deleteAllGames(): Promise<number>;
    getQuestionsForGame(param: DtoGetQuestionsQuery): Promise<IReturnedOneQuestion[]>;
    calculateResult(dto: DtoCalculate): Promise<IReturnedCalculatedResult[]>;
    calculatePerson(count: number, persons: mongoose.Schema.Types.ObjectId[]): Promise<Person>;
    getResultData(dto: DtoCalculate): Promise<IReturnedCalculatedData>;
}
