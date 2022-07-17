import { ErrorMessages } from "./../exceptions/exceptions";
import { User, UserDocument } from "./schemas/user.schema";
import { UserDto } from "./dto/create-user.dto";
import { Token, TokenDocument } from "./schemas/token.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import mongoose from "mongoose";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async getTokenByUser(id: string): Promise<Token> {
    try {
      const token = await this.tokenModel.findOne({ user: id });
      return token;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getUserByToken(token: string): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      const tokens = await this.tokenModel.findOne({
        access_token: token,
      });
      return tokens.user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async createToken(payload: UserDto): Promise<Token> {
    try {
      const userId = await (
        await this.userModel.findOne({ login: payload.login })
      ).id;
      const accessToken = () => this.jwtService.sign({ userId });
      const refreshToken = () =>
        this.jwtService.sign(
          { userId },
          { expiresIn: process.env.REFRESH_EXPIRATION }
        );
      const access_token = accessToken();
      const refresh_token = refreshToken();

      const newTokens = { access_token, refresh_token };
      if (userId != null) {
        const newInfo = await this.tokenModel.findOneAndUpdate(
          { user: userId },
          {
            user: userId,
            ...newTokens,
          },
          {
            upsert: true,
            new: true,
          }
        );
        return newInfo;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async refreshTokens(token: string) {
    try {
      const tokenDocument = await this.tokenModel.findOne({
        refresh_token: token,
      });
      if (tokenDocument === null) {
        throw new Error(ErrorMessages.CANNOT_FIND_TOKEN);
      }
      const userDocument = await this.userModel.findById(tokenDocument.user);
      const decodedRefreshToken = this.jwtService.decode(String(token));

      const refreshTokenNotExpired =
        new Date(decodedRefreshToken["exp"] * 1000) >= new Date(Date.now());

      if (
        userDocument != null &&
        refreshTokenNotExpired &&
        tokenDocument != null
      ) {
        const newTokens = await this.createToken(userDocument);
        return newTokens;
      } else {
        throw new Error("user is null");
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
}
