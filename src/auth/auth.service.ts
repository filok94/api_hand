import { Token } from './schemas/token.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import mongoose from 'mongoose';
import loginDto from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  async signUp(dto: UserDto): Promise<Token | number> {
    try {
      const newId = new mongoose.Types.ObjectId();
      const isNotUnique = await this.userModel.findOne({ email: dto.email });
      if (isNotUnique) {
        return HttpStatus.CONFLICT;
      } else {
        const hashPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.userModel.create({
          password: hashPassword,
          email: dto.email,
          isAdmin: false,
          _id: newId,
        });
        await user.save();

        const tokens = await this.signIn({
          email: dto.email,
          password: dto.password,
        });
        return tokens;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async signIn(dto: loginDto): Promise<Token> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      const isPassword = await bcrypt.compare(dto.password, user.password);

      if (user && isPassword) {
        return await this.tokenService.createToken({ ...dto });
      } else {
        throw new Error('wrong password');
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
