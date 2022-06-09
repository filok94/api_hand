import { DtoCreatePerson } from "./dto/create_person.dto";
import { Person, PersonDocument } from "./schemas/person.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import mongoose from "mongoose";

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>
  ) {}

  async getPersonById(
    id: mongoose.Schema.Types.ObjectId
  ): Promise<PersonDocument> {
    try {
      return await this.personModel.findById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async calculatePerson(
    count: number,
    persons: mongoose.Schema.Types.ObjectId[]
  ): Promise<PersonDocument> {
    try {
      return await this.personModel.findOne({
        count: count,
        _id: { $in: persons },
      });
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

  async adminDeleteAllPersons(): Promise<number> {
    try {
      const count = (await this.personModel.deleteMany()).deletedCount;
      return count;
    } catch (e) {
      throw new Error(e);
    }
  }

  async adminCreateOnePerson(
    dto: DtoCreatePerson
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      const newPerson = await (await this.personModel.create(dto)).save();
      return newPerson.id;
    } catch (e) {
      throw new Error(e);
    }
  }
}
