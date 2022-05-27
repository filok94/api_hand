import { CreateAvatarDto } from './dto/create_avatar_dto';
import { AvatarService } from './avatar.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

@Controller('avatars')
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  @Get('get_all')
  async getAllAvatars() {
    try {
      return await this.avatarService.getAllAvatars();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }

  @Post('create')
  async createAvatarInfo(@Body() dto: CreateAvatarDto) {
    try {
      const avatarId = await this.avatarService.createAvatarInfo(dto);
      return { id: avatarId };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException().getResponse();
    }
  }
  @Delete('delete_all')
  async deleteAll() {
    try {
      const deletedCount = await this.avatarService.deleteAllAvatarinfo();
      return { deleted: deletedCount };
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException().getResponse();
    }
  }
}
