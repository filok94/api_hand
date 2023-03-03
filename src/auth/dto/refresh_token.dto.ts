import { IsJWT, IsNotEmpty } from 'class-validator'

export default class RefreshTokenDto {
	@IsNotEmpty()
	@IsJWT()
	  refresh_token: string
}
