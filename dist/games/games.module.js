"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const auth_module_1 = require("./../auth/auth.module");
const person_service_1 = require("./person.service");
const game_schema_1 = require("./schemas/game.schema");
const mongoose_1 = require("@nestjs/mongoose");
const games_service_1 = require("./games.service");
const games_controller_1 = require("./games.controller");
const common_1 = require("@nestjs/common");
let GamesModule = class GamesModule {
};
GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: game_schema_1.Game.name, schema: game_schema_1.GameSchema },
                { name: game_schema_1.Person.name, schema: game_schema_1.PersonSchema },
                { name: game_schema_1.TestData.name, schema: game_schema_1.TestDataSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [games_controller_1.GamesController],
        providers: [games_service_1.GamesService, person_service_1.PersonService],
    })
], GamesModule);
exports.GamesModule = GamesModule;
//# sourceMappingURL=games.module.js.map