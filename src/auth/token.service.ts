import { ITokensResponse } from '../auth/interfaces/responses'
import { ErrorMessages } from './../exceptions/exceptions'
import { User, UserDocument } from './schemas/user.schema'
import { Token } from './schemas/token.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import LoginDto from './dto/login.dto'

@Injectable()
export class TokenService {
  constructor (
		private jwtService: JwtService,
		@InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async getTokenByUser (id: string): Promise<Token> {
    try {
      const { tokens } = await this.userModel.findById(id)
      return tokens.at(-1)
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async getUserByToken (token: string): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ 'tokens.access_token': token })
    } catch (e) {
      throw new Error(e)
    }
  }

  async createTokens (payload: LoginDto): Promise<Token> {
    try {
      const { login } = payload
      const accessToken = () => this.jwtService.sign({ login })
      const refreshToken = () =>
        this.jwtService.sign({ login },
                             { expiresIn: process.env.REFRESH_EXPIRATION })
      const access_token = accessToken()
      const refresh_token = refreshToken()

      const newTokens = { access_token, refresh_token }
      const { tokens } = await this.userModel.findOneAndUpdate({ login },
                                                               {
                                                                 $push: {
                                                                   tokens: {
                                                                     $each: [{ ...newTokens }],
                                                                     $slice: -5
                                                                   }
                                                                 }
                                                               },
                                                               { new: true })
      return tokens.at(-1)
    } catch (e) {
      throw new Error(e)
    }
  }

  async refreshTokens (token: string): Promise<ITokensResponse> {
    try {
      const { id, is_admin, login, password } = await this.userModel.findOne({ 'tokens.refresh_token': token })
      const decodedRefreshToken = this.jwtService.decode(String(token))
      // validation
      if (!id) {
        throw new Error(ErrorMessages.CANNOT_FIND_TOKEN)
      }
      const refreshTokenNotExpired = new Date(Object(decodedRefreshToken).exp * 1000) >= new Date(Date.now())
      if (!refreshTokenNotExpired) {
        throw new Error(ErrorMessages.TOKEN_EXPIRED)
      }
      await this.userModel.findOneAndUpdate({ login }, {
        $pull: {
          tokens: { refresh_token: token }
        }
      })
      const { access_token, refresh_token } = await this.createTokens({ login, password })
      return {
        access_token,
        refresh_token,
        user: id,
        is_admin
      }
    } catch (e) {
      if (String(e).includes('Cannot destructure property')) {
        throw new Error(ErrorMessages.CANNOT_FIND_TOKEN)
      }
      throw new Error(e)
    }
  }
}
