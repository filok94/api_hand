import { PersonService } from "./person.service";
import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	Query,
} from "@nestjs/common";
import { ErrorMessages, ExcepitonsStrings } from "../exceptions/exceptions";
import { DtoPersonIdQuery } from "./dto/queries.dto";

@Controller("person")
export class PersonController {
	constructor(private personService: PersonService) {}

	@Get()
	async getPersonById(@Query() query: DtoPersonIdQuery) {
		try {
			return await this.personService.getPersonById(query.id);
		} catch (e) {
			const errorMessage = String(e.message);
			if (
				errorMessage.includes(ExcepitonsStrings.CAST_ERROR) ||
				errorMessage.includes(ExcepitonsStrings.CANNOT_READ_NULL)
			) {
				throw new HttpException(
					ErrorMessages.NOT_FOUND,
					HttpStatus.BAD_REQUEST
				);
			}
			if (errorMessage.includes(ErrorMessages.CANNOT_FIND_PERSON)) {
				throw new NotFoundException(errorMessage);
			}
			console.log(errorMessage);
			throw new InternalServerErrorException();
		}
	}
}
