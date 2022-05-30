import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GamesService } from "./games.service";
import { PersonService } from "./person.service";

@UseGuards(AuthGuard())
@Controller("admin/games")
export class GamesAdminController {
  constructor(
    private gamesService: GamesService,
    private personService: PersonService
  ) {}
}
