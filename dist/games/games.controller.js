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
exports.GamesController = void 0;
const is_right_dto_1 = require("./dto/is_right.dto");
const exceptions_1 = require("../exceptions/exceptions");
const person_service_1 = require("./person.service");
const create_game_dto_1 = require("./dto/create_game.dto");
const games_service_1 = require("./games.service");
const common_1 = require("@nestjs/common");
const create_person_dto_1 = require("./dto/create_person.dto");
const passport_1 = require("@nestjs/passport");
const queries_dto_1 = require("./dto/queries.dto");
let GamesController = class GamesController {
    constructor(gamesService, personService) {
        this.gamesService = gamesService;
        this.personService = personService;
    }
    async getAllGames() {
        try {
            return await this.gamesService.getAllGames();
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
    async createGame(dto) {
        try {
            return await this.gamesService.createGame(dto);
        }
        catch (e) {
            console.log(e.message);
            if (String(e.message).includes('E11000')) {
                throw new common_1.HttpException(`one of persons ${exceptions_1.ErrorMessages.DUPLICATES}`, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                throw new common_1.InternalServerErrorException().getResponse();
            }
        }
    }
    async deleteAllGames() {
        try {
            const deletedCount = await this.gamesService.deleteAllGames();
            return { deleted: deletedCount };
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
    async deleteAllPersons() {
        try {
            const deletedCount = await this.personService.deleteAllPersons();
            return { deleted: deletedCount };
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
    async createNewPerson(dto) {
        try {
            const personId = await this.personService.createOnePerson(dto);
            return { person_id: personId };
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
    async getAllPersons() {
        try {
            return await this.personService.getAllPersons();
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException().getResponse();
        }
    }
    async getGameById(query) {
        try {
            return await this.gamesService.getGameById(query.id);
        }
        catch (e) {
            if (String(e.message).includes(exceptions_1.ErrorMessages.NOT_FOUND)) {
                throw new common_1.HttpException(exceptions_1.ErrorMessages.NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                throw new common_1.InternalServerErrorException().getResponse();
            }
        }
    }
    async getQuestionWithAnswers(params) {
        try {
            return await this.gamesService.getQuestionsForGame(params);
        }
        catch (e) {
            const errorMessage = String(e.message);
            console.log(errorMessage);
            if (errorMessage.includes(exceptions_1.ExcepitonsStrings.CAST_ERROR) ||
                errorMessage.includes(exceptions_1.ExcepitonsStrings.CANNOT_READ_NULL)) {
                throw new common_1.HttpException(exceptions_1.ErrorMessages.NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
    async isAnswerRight(body) {
        try {
            return await this.gamesService.getResultData(body);
        }
        catch (e) {
            const errorMessage = String(e.message);
            console.log(errorMessage);
            if (errorMessage.includes(exceptions_1.ExcepitonsStrings.CAST_ERROR)) {
                throw new common_1.HttpException(exceptions_1.ErrorMessages.NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.InternalServerErrorException().getResponse();
        }
    }
};
__decorate([
    (0, common_1.Get)('get_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getAllGames", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.DtoCreateGame]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "createGame", null);
__decorate([
    (0, common_1.Delete)('delete_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "deleteAllGames", null);
__decorate([
    (0, common_1.Delete)('person/delete_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "deleteAllPersons", null);
__decorate([
    (0, common_1.Post)('person/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_person_dto_1.DtoCreatePerson]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "createNewPerson", null);
__decorate([
    (0, common_1.Get)('person/get_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getAllPersons", null);
__decorate([
    (0, common_1.Get)('get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queries_dto_1.IQueryGetGame]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameById", null);
__decorate([
    (0, common_1.Get)('get_questions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queries_dto_1.DtoGetQuestionsQuery]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getQuestionWithAnswers", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_right_dto_1.DtoCalculate]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "isAnswerRight", null);
GamesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [games_service_1.GamesService,
        person_service_1.PersonService])
], GamesController);
exports.GamesController = GamesController;
//# sourceMappingURL=games.controller.js.map