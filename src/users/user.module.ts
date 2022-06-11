import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./../auth/auth.module";
import { UserService } from "./user.service";
import { UserController } from "./user.contoller";
import { Module } from "@nestjs/common";

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
