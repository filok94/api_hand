import { SetUserAdminDto } from "./dto/set_user_admin.dto";
import { ErrorMessages } from "./../exceptions/exceptions";
import { TokenService } from "./../auth/token.service";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../auth/schemas/user.schema";
import { Model } from "mongoose";
import mongoose from "mongoose";
import { use } from "passport";
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers(): Promise<any> {
    try {
      return await this.userModel.find();
    } catch (error) {
      console.error(error.message);
    }
  }

  async getUserById(
    id: string | mongoose.Schema.Types.ObjectId
  ): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id);
    } catch (e) {
      throw new Error(e);
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

  async setUserAdmin(dto: SetUserAdminDto): Promise<boolean> {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { login: dto.login },
        {
          is_admin: dto.admin,
        },
        { new: true }
      );
      if (!user) {
        throw new Error(ErrorMessages.CANNOT_FIND_LOGIN);
      }
      return user != null;
    } catch (e) {
      throw new Error(e);
    }
  }
}
