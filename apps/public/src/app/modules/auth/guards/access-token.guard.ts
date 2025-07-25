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

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtUserConfig.KEY)
    private readonly jwtUserConfiguration: ConfigType<typeof jwtUserConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is required!');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtUserConfiguration
      );
      request[REQUEST_USER_KEY] = payload;
    } catch (e) {
      throw new UnauthorizedException('Token is invalid!');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.header('Authorization')?.split(' ') ?? [];
    return token;
  }
}
