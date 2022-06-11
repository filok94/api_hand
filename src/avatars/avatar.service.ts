import { ErrorMessages } from "./../exceptions/exceptions";
import { DtoSaveAvatar } from "./dto/save_avatar.dto";
import { TokenService } from "./../auth/token.service";
import {
  IPropObject,
  IReturnedOneAvatar,
} from "./interfaces/avatar.interface.d";
import { IAllAvatar } from "./interfaces/avatar.interface";
import { CreateAvatarDto } from "./dto/create_avatar_dto";
import {
  Avatar,
  AvatarDocument,
  AvatarProps,
  AvatarPropsDocument,
  UserAvatar,
  UserAvatarDocument,
} from "./schemas/avatar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import mongoose from "mongoose";

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
    @InjectModel(AvatarProps.name)
    private avatarPropsModel: Model<AvatarPropsDocument>,
    @InjectModel(UserAvatar.name)
    private userAvatarModel: Model<UserAvatarDocument>,
    private tokenService: TokenService
  ) {}

  async getAllAvatars(): Promise<IAllAvatar[]> {
    try {
      const avatarsInDb = await this.avatarModel.find();
      const returnedAvatars: IAllAvatar[] = avatarsInDb.map(
        (e: AvatarDocument) => {
          return {
            ref_name: e.ref_name,
            base_link: e.base_link,
            id: e.id,
          };
        }
      );
      return returnedAvatars;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAvatarById(
    id: mongoose.Schema.Types.ObjectId
  ): Promise<IReturnedOneAvatar> {
    try {
      const avatarProps: IPropObject[] = [];
      const avatar = await this.avatarModel.findById(id);

      for (const prop of avatar.props) {
        const propById = await this.avatarPropsModel.findById(prop);
        avatarProps.push({
          prop_name: propById.prop_name,
          prop_values: propById.values,
          with_probability: propById.with_probability,
        });
      }
      return {
        ref_name: avatar.ref_name,
        base_link: avatar.base_link,
        props: avatarProps,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async saveAvatarForUser(
    userToken: string,
    avatarInfo: DtoSaveAvatar
  ): Promise<boolean> {
    try {
      const userId = await this.tokenService.getUserByToken(userToken);
      const avatarLinkInDb = (await this.getAvatarById(avatarInfo.avatar))
        .base_link;
      if (!avatarInfo.full_link.includes(avatarLinkInDb)) {
        throw new Error(ErrorMessages.LINK_NOT_RELATE_TO_AVATAR);
      }
      const newRecord = await this.userAvatarModel.updateOne(
        {
          user: userId,
        },
        {
          user: userId,
          full_link: avatarInfo.full_link,
          avatar: avatarInfo.avatar,
        },
        { new: true, upsert: true, rawResult: true }
      );

      return newRecord.acknowledged;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserAvatarLink(token: string): Promise<string> {
    try {
      const userId = await this.tokenService.getUserByToken(token);
      const usersAvatar = await this.userAvatarModel.findOne({ user: userId });
      if (!usersAvatar) {
        return (await this.avatarModel.find())[0].base_link;
      }
      return usersAvatar.full_link;
    } catch (e) {
      throw new Error(e);
    }
  }

  async isAvatarExists(id: mongoose.Schema.Types.ObjectId): Promise<boolean> {
    try {
      const avatar = await (await this.avatarModel.findById(id)).id;
      if (avatar != null) return true;
    } catch (e) {
      return false;
    }
  }

  async createAvatarInfo(
    dto: CreateAvatarDto
  ): Promise<mongoose.Schema.Types.ObjectId> {
    try {
      const ids = [];
      for (const prop of dto.props) {
        const newProp = await this.avatarPropsModel.create({
          prop_name: prop.prop_name,
          values: prop.values,
          with_probability: prop.with_probability,
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
}
