import { RolesGuard } from "./../roles_guard/roles_guard";
import { Roles } from "./../roles_guard/roles.decorator";
import { PersonService } from "./person.service";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { DtoCreatePerson } from "./dto/create_person.dto";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard(), RolesGuard)
@Controller("admin/person")
export class AdminPersonController {
  constructor(private personService: PersonService) {}
  @Roles("admin")
  @Get("get_all")
  async getAllPersons() {
    try {
      return await this.personService.getAllPersons();
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException().getResponse();
    }
  }
  @Roles("admin")
  @Post("create")
  async createNewPerson(@Body() dto: DtoCreatePerson) {
    try {
      const personId = await this.personService.adminCreateOnePerson(dto);
      return { person_id: personId };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }
}
