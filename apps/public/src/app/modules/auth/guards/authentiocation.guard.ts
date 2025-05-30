import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AUTH_TYPE, AuthType } from '@nestjs-booking-clone/common';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  private static readonly defaultAuthType = AUTH_TYPE.BEARER;
  private readonly authTypeGuardMap = {
    [AUTH_TYPE.BEARER]: this.accessTokenGuard,
    [AUTH_TYPE.NONE]: {
      canActivate: () => true,
    },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map(authType => this.authTypeGuardMap[authType]).filter(Boolean).flat();
    let error = new UnauthorizedException();

    for (const guard of guards) {
       try {
        const canActivate = await guard.canActivate(context);
        if (canActivate) {
          return true;
        }
      } catch(err) {
        error = err;
      }
    }

    throw error;
  }
}
