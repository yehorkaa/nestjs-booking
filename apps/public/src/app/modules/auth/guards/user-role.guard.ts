import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entities/user.entity';
import { USER_ROLE_KEY } from '../decorators/user-role.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<User['role'][]>(
      USER_ROLE_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false;
    }
    return requiredRoles.some((role) => role === user.role);
  }
}
