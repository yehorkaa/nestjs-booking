import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtUserConfig from '../config/jwt-user.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../auth.const';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtUserConfig.KEY)
    private readonly jwtUserConfiguration: ConfigType<typeof jwtUserConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get('', context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtUserConfiguration);
      request[REQUEST_USER_KEY] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.header('Authorization')?.split(' ') ?? [];
    return token;
  }
}
