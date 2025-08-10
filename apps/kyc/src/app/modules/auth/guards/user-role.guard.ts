import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
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
    
    const requiredRolesMap = requiredRoles.reduce((acc, role) => {
      acc[role] = role;
      return acc;
    }, {} as Record<PublicUserRole, PublicUserRole>);

    const hasUnauthorizedRole = user.roles.some(
      (role) => !requiredRolesMap[role]
    );

    if (hasUnauthorizedRole) {
      throw new ForbiddenException('You either already have or cannot have this role');
    }

    return true;
  }
}
