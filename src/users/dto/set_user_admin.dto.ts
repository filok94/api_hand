import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class SetUserAdminDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  login: string;

  @IsBoolean()
  @IsNotEmpty()
  admin: boolean;
}
