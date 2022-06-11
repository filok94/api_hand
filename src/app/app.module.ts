import { IsIdExistsAndCorrectConstraint } from "./../validators/id_validator";
import { AvatarModule } from "../avatars/avatar.module";
import { UserModule } from "./../users/user.module";
import { AuthModule } from "../auth/auth.module";
import { GamesModule } from "../games/games.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";

@Module({
  controllers: [],
  providers: [IsIdExistsAndCorrectConstraint],
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    GamesModule,
    AuthModule,
    UserModule,
    AvatarModule,
  ],
})
export class AppModule {}
