import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class UserAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
