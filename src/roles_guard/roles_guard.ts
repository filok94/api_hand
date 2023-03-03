import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenService } from 'src/auth/token.service'

interface req { headers: { token: string } }
@Injectable()
export class RolesGuard implements CanActivate {
  constructor (
		private reflector: Reflector,
		private tokenService: TokenService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    const request: req = context.switchToHttp().getRequest()
    const token = request.headers.token
    if (!roles) {
      return true
    }
    const user = await this.tokenService.getUserByToken(token)
    return user.is_admin
  }
}
