import { PersonService } from "./person.service";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { DtoCreatePerson } from "./dto/create_person.dto";

@Controller("admin/person")
export class AdminPersonController {
  constructor(private personService: PersonService) {}

  @Get("get_all")
  async getAllPersons() {
    try {
      return await this.personService.getAllPersons();
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException().getResponse();
    }
  }

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
