import { SetUserAdminDto } from './dto/set_user_admin.dto'
import { ErrorMessages } from './../exceptions/exceptions'
import { HttpCode, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../auth/schemas/user.schema'
import mongoose, { Model } from 'mongoose'
@Injectable()
export class UserService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers (): Promise<any> {
    try {
      return await this.userModel.find()
    } catch (error) {
      throw new Error(error)
    }
  }

  async getUserById (
    id: string | mongoose.Schema.Types.ObjectId
  ): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id)
    } catch (e) {
      throw new Error(e)
    }
  }

	@HttpCode(200)
  async setUserAdmin (dto: SetUserAdminDto): Promise<boolean> {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { login: dto.login },
        {
          is_admin: dto.admin
        },
        { new: true }
      )
      if (!user) {
        throw new Error(ErrorMessages.CANNOT_FIND_LOGIN)
      }
      return user != null
    } catch (e) {
      throw new Error(e)
    }
  }
}
