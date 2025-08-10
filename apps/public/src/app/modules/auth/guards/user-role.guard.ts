import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLES_KEY } from '../decorators/user-role.decorator';

import { ActiveUserModel } from '../decorators/active-user.decorator';
import { PublicUserRole } from '@nestjs-booking-clone/common';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<PublicUserRole[]>(
      USER_ROLES_KEY,
      context.getHandler()
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: ActiveUserModel }>();
    if (!user || !user.roles) {
      return false;
    }

    const rolesMap = user.roles.reduce((acc, role) => {
      acc[role] = true;
      return acc;
    }, {} as Record<PublicUserRole, boolean>);

    return requiredRoles.some((role) => rolesMap[role]);
  }
}
