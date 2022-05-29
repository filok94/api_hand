import { AuthModule } from "./../auth/auth.module";
import { PersonService } from "./person.service";
import {
  Game,
  GameSchema,
  TestData,
  TestDataSchema,
} from "./schemas/game.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { GamesService } from "./games.service";
import { GamesController } from "./games.controller";
import { Module } from "@nestjs/common";
import { UserGames, UserGamesSchema } from "./schemas/user_games.schema";
import { Person, PersonSchema } from "./schemas/person.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Person.name, schema: PersonSchema },
      { name: TestData.name, schema: TestDataSchema },
      { name: UserGames.name, schema: UserGamesSchema },
    ]),
    AuthModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, PersonService],
})
export class GamesModule {}
