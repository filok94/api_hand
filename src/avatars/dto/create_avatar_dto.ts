import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

export class AvatarProp {
	@IsNotEmpty()
	@IsString()
  readonly prop_name: string

	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	readonly values: string[]

	@IsNotEmpty()
	@IsString()
	@IsOptional()
	readonly probability: string | null
}
export class CreateAvatarDto {
	@IsNotEmpty()
	@IsString()
  readonly ref_name: string

	@IsNotEmpty()
	@IsString()
	readonly base_link: string

	@ValidateNested({ each: true })
	@Type(() => AvatarProp)
	@IsArray()
	@ArrayMinSize(1)
	@IsNotEmpty()
	readonly props: AvatarProp[]
}
