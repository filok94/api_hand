import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export default class LoginDto {
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
