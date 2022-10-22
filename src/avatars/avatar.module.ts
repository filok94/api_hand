import { UserModule } from "./../users/user.module";
import { AuthModule } from "./../auth/auth.module";
import { AvatarService } from "./avatar.service";
import { AvatarController } from "./avatar.controller";
import {
	Avatar,
	AvatarSchema,
	UserAvatar,
	UserAvatarSchema,
} from "./schemas/avatar.schema";
import { MongooseModule } from "@nestjs/mongoose";

import { Module } from "@nestjs/common";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Avatar.name, schema: AvatarSchema },
			{ name: UserAvatar.name, schema: UserAvatarSchema },
		]),
		AuthModule,
		UserModule,
	],
	controllers: [AvatarController],
	providers: [AvatarService],
	exports: [AvatarService],
})
export class AvatarModule {}
