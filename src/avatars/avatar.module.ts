import { AvatarService } from "./avatar.service";
import { AvatarController } from "./avatar.controller";
import {
  Avatar,
  AvatarSchema,
  AvatarProps,
  AvatarPropsSchema,
} from "./schemas/avatar.schema";
import { MongooseModule } from "@nestjs/mongoose";

import { Module } from "@nestjs/common";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Avatar.name, schema: AvatarSchema },
      { name: AvatarProps.name, schema: AvatarPropsSchema },
    ]),
  ],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
