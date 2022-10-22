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
	constructor() {}
	returnMessage = "";
	async validate(
		id: mongoose.Schema.Types.ObjectId,
		args: ValidationArguments
	) {
		const [idType] = args.constraints as ServiceType[];
		if (!mongoose.Types.ObjectId.isValid(String(id))) {
			this.returnMessage = `${idType} id is incorrect`;
			return false;
		}
		//если ни одна из проверок не выдала ошибки, то возвращаем true
		return true;
	}
	defaultMessage(): string {
		return this.returnMessage;
	}
}

export function IsIdCorrect(
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
