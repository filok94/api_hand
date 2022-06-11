import { SetMetadata } from "@nestjs/common";
export type IRoles = "admin" | "user";
export const Roles = (...roles: IRoles[]) => SetMetadata("roles", roles);
