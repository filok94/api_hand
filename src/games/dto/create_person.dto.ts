import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
export class DtoCreatePerson {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  readonly description: string

  @IsNotEmpty()
  @IsString()
  readonly link: string

  @IsNotEmpty()
  @IsNumber()
  readonly count: number
}
