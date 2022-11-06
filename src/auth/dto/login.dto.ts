import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export default class LoginDto {
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@IsString()
	login: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(255)
	@IsString()
	password: string;
}
