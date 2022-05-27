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
exports.PersonService = void 0;
const game_schema_1 = require("./schemas/game.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PersonService = class PersonService {
    constructor(personModel) {
        this.personModel = personModel;
    }
    async createOnePerson(dto) {
        try {
            const newPerson = await (await this.personModel.create(dto)).save();
            return newPerson.id;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async getAllPersons() {
        try {
            const persons = await this.personModel.find();
            return persons;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async deleteAllPersons() {
        try {
            const count = (await this.personModel.deleteMany()).deletedCount;
            return count;
        }
        catch (e) {
            throw new Error(e);
        }
    }
};
PersonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Person.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map