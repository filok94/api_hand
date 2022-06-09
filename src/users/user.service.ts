import { TokenService } from "./../auth/token.service";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../auth/schemas/user.schema";
import { Model } from "mongoose";
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService
  ) {}
  async getAllUsers(): Promise<any> {
    try {
      return await this.userModel.find();
    } catch (error) {
      console.error(error.message);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAllUsers(): Promise<boolean> {
    try {
      await this.tokenService.deleteAllTokens();
      await this.userModel.deleteMany().exec();
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllTokens() {
    try {
      return await this.tokenService.getAllTokens();
    } catch (e) {
      throw new Error(e);
    }
  }
}
