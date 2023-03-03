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
      const user = await this.userModel.create({
        password: hashPassword,
        login: dto.login,
        is_admin: false
      })

      const tokens = await this.tokenService.createToken({
        ...dto
      })
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: tokens.user,
        is_admin: user.is_admin
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  async signIn (dto: LoginDto): Promise<ITokensResponse> {
    try {
      const user = await this.userModel.findOne({
        login: dto.login
      })
      const isPasswordCorrect = await bcrypt.compare(
        dto.password,
        user.password
      )

      if (user && isPasswordCorrect) {
        const tokens = await this.tokenService.createToken({
          ...dto
        })
        return {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          user: tokens.user,
          is_admin: user.is_admin
        }
      } else {
        throw new Error('wrong password')
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
