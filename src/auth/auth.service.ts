import { ITokensResponse } from './interfaces/responses'
import { User, UserDocument } from './schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { TokenService } from './token.service'
import LoginDto from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor (
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private tokenService: TokenService
  ) {}

  async signUp (dto: LoginDto): Promise<ITokensResponse> {
    try {
      const hashPassword = await bcrypt.hash(dto.password, 12)
      const { is_admin, _id } = await this.userModel.create({
        password: hashPassword,
        login: dto.login,
        is_admin: false
      })

      const { access_token, refresh_token } = await this.tokenService.createTokens({
        ...dto
      })
      return {
        access_token,
        refresh_token,
        user: _id,
        is_admin
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  async signIn (dto: LoginDto): Promise<ITokensResponse> {
    try {
      const { login, password: dtoPassword } = dto
      const { _id, password, is_admin } = await this.userModel.findOne({ login })
      const isPasswordCorrect = await bcrypt.compare(dtoPassword,
                                                     password)

      if (_id && isPasswordCorrect) {
        const { access_token, refresh_token } = await this.tokenService.createTokens({
          ...dto
        })

        return {
          access_token,
          refresh_token,
          is_admin,
          user: _id
        }
      } else {
        throw new Error('wrong password')
      }
    } catch (e) {
      if (String(e).includes("Cannot destructure property '_id'")) {
        throw new Error('wrong password')
      }
      throw new Error(e)
    }
  }
}
