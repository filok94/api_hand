import { AvatarService } from "./../avatar.service";
import mongoose from "mongoose";

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateLinkConstraint implements ValidatorConstraintInterface {
  constructor(private avatarService: AvatarService) {}
  #returnMessage = "";
  async validate(link: string, args: ValidationArguments) {
    try {
      //проверка, что id валидно
      const avatarId = args.object["avatar"] as mongoose.Schema.Types.ObjectId;
      if (!mongoose.Types.ObjectId.isValid(String(avatarId))) {
        this.#returnMessage = "cannot read link for incorrect id";
        return false;
      }

      //проверка, что аватар существует
      const isAvatarExist = await this.avatarService.isAvatarExists(avatarId);
      if (!isAvatarExist) {
        this.#returnMessage = "cannot check link for unknown avatar id";
        return false;
      }

      // проверка, что ссылка корректна
      const avatarLinkInDb = (await this.avatarService.getAvatarById(avatarId))
        .base_link;
      if (!link.includes(avatarLinkInDb)) {
        this.#returnMessage = "link does not relate to this avatar id";
        return false;
      }

      return true;
    } catch (e) {
      console.log(e);
    }
  }
  defaultMessage(): string {
    return this.#returnMessage;
  }
}

export function ValidateLink(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateLinkConstraint,
    });
  };
}
