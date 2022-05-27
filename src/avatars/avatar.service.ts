import { IAllAvatars } from './avatar.interface';
import { CreateAvatarDto } from './dto/create_avatar_dto';
import {
  Avatar,
  AvatarDocument,
  AvatarProps,
  AvatarPropsDocument,
} from './schemas/avatar.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
    @InjectModel(AvatarProps.name)
    private avatarPropsModel: Model<AvatarPropsDocument>,
  ) {}

  async getAllAvatars(): Promise<IAllAvatars> {
    try {
      const props = await this.avatarPropsModel.find();
      const avatars = await this.avatarModel.find();
      return { avatars, props };
    } catch (e) {
      throw new Error(e);
    }
  }

  async createAvatarInfo(
    dto: CreateAvatarDto,
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      const ids = [];
      for (const prop of dto.props) {
        const newProp = await this.avatarPropsModel.create({
          prop_name: prop.prop_name,
          values: prop.values,
        });
        ids.push(newProp._id);
      }
      const avatarInfo = await this.avatarModel.create({
        ref_name: dto.ref_name,
        base_link: dto.base_link,
        props: ids,
      });
      return avatarInfo._id;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAllAvatarinfo(): Promise<number> {
    try {
      const deletedProps = (await this.avatarPropsModel.deleteMany())
        .deletedCount;
      const deletedAvatarInfo = (await this.avatarModel.deleteMany())
        .deletedCount;
      return Math.max(deletedAvatarInfo, deletedProps);
    } catch (e) {
      throw new Error(e);
    }
  }
}
