import { AvatarService } from "./../avatars/avatar.service";
import { PersonService } from "./../games/person.service";
import { GamesService } from "./../games/games.service";

import mongoose from "mongoose";

import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
type ServiceType = "game" | "person" | "avatar";
@ValidatorConstraint({ async: true })
@Injectable()
export class IsIdExistsAndCorrectConstraint
	implements ValidatorConstraintInterface
{
	constructor(
		private gameService: GamesService,
		private personService: PersonService,
		private avatarService: AvatarService
	) {}
	returnMessage = "";
	async validate(
		id: mongoose.Schema.Types.ObjectId,
		args: ValidationArguments
	) {
		const [idType] = args.constraints as ServiceType[];
		//проверка корректности айди
		if (!mongoose.Types.ObjectId.isValid(String(id))) {
			this.returnMessage = `${idType} id is incorrect`;
			return false;
		}

		//проверка существует ли такой айди в базе

		switch (idType) {
			case "game":
				const idGame = await this.gameService.adminGetGameById(id);
				if (idGame.game == null) {
					this.returnMessage = `cannot find game with this id`;
					return false;
				}
				break;
			case "person":
				const personId = await this.personService.getPersonById(id);
				if (personId == null) {
					this.returnMessage = `cannot find person with this id`;
					return false;
				}
				break;
			case "avatar":
				const isExist = await this.avatarService.isAvatarExists(id);
				if (!isExist) {
					this.returnMessage = "cannot find avatar with this id";
					return false;
				}
			default:
				return true;
		}

		//если ни одна из проверок не выдала ошибки, то возвращаем true
		return true;
	}
	defaultMessage(): string {
		return this.returnMessage;
	}
}

export function IsIdExistsAndCorrect(
	property: ServiceType,
	validationOptions?: ValidationOptions
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: IsIdExistsAndCorrectConstraint,
		});
	};
}
