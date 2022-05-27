import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/create-user.dto';
import { Token, TokenDocument } from './schemas/token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTokenByUser(id: string): Promise<Token> {
    try {
      const token = await this.tokenModel.findOne({ user: id });
      return token;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async createToken(payload: UserDto): Promise<Token> {
    try {
      const userId = await (
        await this.userModel.findOne({ email: payload.email })
      )?.id;
      const accessToken = () => this.jwtService.sign({ userId });
      const refreshToken = () =>
        this.jwtService.sign(
          { userId },
          { expiresIn: process.env.REFRESH_EXPIRATION },
        );
      const access_token = accessToken();
      const refresh_token = refreshToken();

      const newTokens = { access_token, refresh_token };
      if (userId != null) {
        const userTokens = await this.tokenModel.findOne({ user: userId });
        if (userTokens) {
          await this.tokenModel.findOneAndDelete({ user: userId });
        }
        const newInfo = await this.tokenModel.create({
          user: userId,
          ...newTokens,
        });
        return await newInfo.save();
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async refreshTokens(token: mongoose.Schema.Types.ObjectId) {
    try {
      const userTokens = await this.tokenModel.findOne({
        refresh_token: token,
      });
      const user = await this.userModel.findById(userTokens.user);
      const decodedToken = this.jwtService.decode(String(token));

      const refTokenExpiration =
        new Date(decodedToken['exp'] * 1000) >= new Date(Date.now());

      if (user && refTokenExpiration && userTokens) {
        const newTokens = await this.createToken(user);
        return newTokens;
      } else {
        throw new Error('user is null');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllTokens() {
    try {
      const tokens = await this.tokenModel.find();
      return tokens;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAllTokens() {
    try {
      const tokens = await this.tokenModel.deleteMany().exec();
      return tokens;
    } catch (e) {
      throw new Error(e);
    }
  }
}
