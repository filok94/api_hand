import { DtoCreatePerson } from './dto/create_person.dto';
import { Person, PersonDocument } from './schemas/game.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
export declare class PersonService {
    private personModel;
    constructor(personModel: Model<PersonDocument>);
    createOnePerson(dto: DtoCreatePerson): Promise<mongoose.Schema.Types.ObjectId>;
    getAllPersons(): Promise<Person[]>;
    deleteAllPersons(): Promise<number>;
}
