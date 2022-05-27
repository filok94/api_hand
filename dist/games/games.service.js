"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const exceptions_1 = require("./../exceptions/exceptions");
const game_schema_1 = require("./schemas/game.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let GamesService = class GamesService {
    constructor(gameModel, personModel, testDataModel) {
        this.gameModel = gameModel;
        this.personModel = personModel;
        this.testDataModel = testDataModel;
    }
    async getAllGames() {
        try {
            return await this.gameModel.find();
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async getGameById(id) {
        try {
            const game = await this.gameModel.findById(id);
            const data = await this.testDataModel.find({ game: id });
            return { game, question_block: data };
        }
        catch (e) {
            throw new Error(exceptions_1.ErrorMessages.NOT_FOUND);
        }
    }
    async createGame(dto) {
        try {
            let foundCount = 0;
            for (const person of dto.persons) {
                const isPersonExist = await this.personModel.find({ _id: person });
                isPersonExist ? foundCount++ : null;
            }
            if (foundCount === dto.persons.length) {
                const newGame = await this.gameModel.create(dto);
                for (const question of dto.question_block) {
                    await this.testDataModel.create(Object.assign({ game: newGame._id }, question));
                }
                const game_data = await this.gameModel.findById(newGame.id);
                return game_data._id;
            }
            else {
                throw new Error();
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async deleteAllGames() {
        try {
            await this.testDataModel.deleteMany();
            return (await this.gameModel.deleteMany()).deletedCount;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async getQuestionsForGame(param) {
        try {
            const gameData = await this.testDataModel.find({
                game: param.game_id,
            });
            const returnedArray = [];
            for (const game of gameData) {
                returnedArray.push({
                    question: game.question,
                    answers: game.answers,
                    index: game.index,
                });
            }
            return returnedArray;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async calculateResult(dto) {
        try {
            const answersAndResults = [];
            for (const answer of dto.answers) {
                const questionData = await this.testDataModel.findOne({
                    game: dto.game_id,
                    index: answer.index,
                });
                const isRight = questionData.right_answer == answer.answer;
                answersAndResults.push({
                    right_answer: questionData.right_answer,
                    user_answer: answer.answer,
                    is_right: isRight,
                });
            }
            return answersAndResults;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async calculatePerson(count, persons) {
        try {
            console.log(count, persons);
            return await this.personModel.findOne({
                count: count,
                _id: { $in: persons },
            });
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async getResultData(dto) {
        const calculatedResult = await this.calculateResult(dto);
        const countOfRightAnswers = calculatedResult.filter((e) => e.is_right).length;
        const gamePersons = (await this.gameModel.findById(dto.game_id)).persons;
        const person = await this.calculatePerson(countOfRightAnswers, gamePersons);
        return {
            person: person,
            test_result: calculatedResult,
        };
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Game.name)),
    __param(1, (0, mongoose_1.InjectModel)(game_schema_1.Person.name)),
    __param(2, (0, mongoose_1.InjectModel)(game_schema_1.TestData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map