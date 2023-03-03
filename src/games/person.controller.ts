import { PersonService } from './person.service'
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseGuards
} from '@nestjs/common'
import { ErrorMessages, ExcepitonsStrings } from '../exceptions/exceptions'
import { DtoIdParams } from './dto/queries.dto'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

@UseGuards(AuthGuard())
@Controller('persons')
export class PersonController {
  constructor (private personService: PersonService) {}

	@Get(':id')
  async getPersonById (@Param() params: DtoIdParams) {
    try {
      return await this.personService.getPersonById(params.id)
    } catch (e) {
      const errorMessage = String(e.message)
      if (
        errorMessage.includes(ExcepitonsStrings.CAST_ERROR) ||
				errorMessage.includes(ExcepitonsStrings.CANNOT_READ_NULL)
      ) {
        throw new HttpException(
          ErrorMessages.NOT_FOUND,
          HttpStatus.NOT_FOUND
        )
      }
      if (errorMessage.includes(ErrorMessages.CANNOT_FIND_PERSON)) {
        throw new NotFoundException(errorMessage)
      }
      console.log(errorMessage)
      throw new InternalServerErrorException()
    }
  }
}
