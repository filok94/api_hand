import { DtoCreatePerson } from './dto/create_person.dto';
import { Person, PersonDocument } from './schemas/game.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
  ) {}

  async createOnePerson(
    dto: DtoCreatePerson,
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      const newPerson = await (await this.personModel.create(dto)).save();
      return newPerson.id;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllPersons(): Promise<Person[]> {
    try {
      const persons = await this.personModel.find();
      return persons;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAllPersons(): Promise<number> {
    try {
      const count = (await this.personModel.deleteMany()).deletedCount;
      return count;
    } catch (e) {
      throw new Error(e);
    }
  }
}
