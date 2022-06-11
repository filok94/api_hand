import { IHeader } from "./../common/common_interfaces.d";
import { DtoAvatarIdQuery } from "./dto/avatar-queries.dto";
import { CreateAvatarDto } from "./dto/create_avatar_dto";
import { AvatarService } from "./avatar.service";
import {
  BadRequestException,
  Body,
  Headers,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DtoSaveAvatar } from "./dto/save_avatar.dto";

@UseGuards(AuthGuard())
@Controller("avatars")
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  @Get("get_all")
  async getAllAvatars() {
    try {
      return await this.avatarService.getAllAvatars();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Put("save")
  async saveAvatarForUser(
    @Body() body: DtoSaveAvatar,
    @Headers() header: IHeader
  ) {
    try {
      return await this.avatarService.saveAvatarForUser(header.token, body);
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);
      throw new InternalServerErrorException();
    }
  }

  @Get("get_my")
  async getUsersAvatar(@Headers() header: IHeader) {
    try {
      const ref_link = await this.avatarService.getUserAvatarLink(header.token);
      return { ref_link };
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  async getById(@Query() query: DtoAvatarIdQuery) {
    try {
      const avatar = await this.avatarService.getAvatarById(query.avatar_id);
      return avatar;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @Post("create")
  async createAvatarInfo(@Body() dto: CreateAvatarDto) {
    try {
      const avatarId = await this.avatarService.createAvatarInfo(dto);
      return { id: avatarId };
    } catch (e) {
      const errorMessage = String(e.message);
      console.log(errorMessage);
      if (errorMessage.includes("E11000")) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException().getResponse();
    }
  }
}
