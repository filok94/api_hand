/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { IReturnedCalculatedData } from './games.interface.d';
import { IReturnedOneQuestion } from './games.interface';
import { DtoCalculate } from './dto/is_right.dto';
import { PersonService } from './person.service';
import { DtoCreateGame } from './dto/create_game.dto';
import { GamesService } from './games.service';
import { DtoCreatePerson } from './dto/create_person.dto';
import { DtoGetQuestionsQuery, IQueryGetGame } from './dto/queries.dto';
export declare class GamesController {
    private gamesService;
    private personService;
    constructor(gamesService: GamesService, personService: PersonService);
    getAllGames(): Promise<import("./schemas/game.schema").Game[]>;
    createGame(dto: DtoCreateGame): Promise<import("mongoose").Schema.Types.ObjectId>;
    deleteAllGames(): Promise<{
        deleted: number;
    }>;
    deleteAllPersons(): Promise<{
        deleted: number;
    }>;
    createNewPerson(dto: DtoCreatePerson): Promise<{
        person_id: import("mongoose").Schema.Types.ObjectId;
    }>;
    getAllPersons(): Promise<import("./schemas/game.schema").Person[]>;
    getGameById(query: IQueryGetGame): Promise<{
        game: import("./schemas/game.schema").Game;
        question_block: import("./schemas/game.schema").TestData[];
    }>;
    getQuestionWithAnswers(params: DtoGetQuestionsQuery): Promise<IReturnedOneQuestion[]>;
    isAnswerRight(body: DtoCalculate): Promise<IReturnedCalculatedData>;
}
