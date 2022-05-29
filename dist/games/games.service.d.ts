import { PersonService } from "./person.service";
import { UserGamesDocument } from "./schemas/user_games.schema";
import { IGetUserGameResult, IReturnedCalculatedData } from "./games.interface.d";
import { IReturnedOneQuestion } from "./games.interface";
import { DtoCalculate } from "./dto/is_right.dto";
import { DtoCreateGame } from "./dto/create_game.dto";
import { Game, GameDocument, TestData, TestDataDocument } from "./schemas/game.schema";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { DtoGetQuestionsQuery } from "./dto/queries.dto";
import { TokenService } from "src/auth/token.service";
import { PersonDocument } from "./schemas/person.schema";
export declare class GamesService {
    private gameModel;
    private personModel;
    private testDataModel;
    private userGamesModel;
    private tokenService;
    private personService;
    constructor(gameModel: Model<GameDocument>, personModel: Model<PersonDocument>, testDataModel: Model<TestDataDocument>, userGamesModel: Model<UserGamesDocument>, tokenService: TokenService, personService: PersonService);
    getAllGames(): Promise<Game[]>;
    getGameById(id: mongoose.Schema.Types.ObjectId): Promise<{
        game: Game;
        question_block: TestData[];
    }>;
    createGame(dto: DtoCreateGame): Promise<mongoose.Schema.Types.ObjectId>;
    deleteAllGames(): Promise<number>;
    getQuestionsForGame(param: DtoGetQuestionsQuery): Promise<IReturnedOneQuestion[]>;
    private calculateResult;
    getResultData(dto: DtoCalculate, userToken: string): Promise<IReturnedCalculatedData>;
    private linkResultToUser;
    getUserResults(data: IGetUserGameResult): Promise<UserGamesDocument>;
}
