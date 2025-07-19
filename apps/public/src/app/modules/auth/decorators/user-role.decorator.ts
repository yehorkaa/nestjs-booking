import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/user.type';

export const USER_ROLES_KEY = 'user-roles';
export const UserRoles = (...roles: UserRole[]) => {
  return SetMetadata(USER_ROLES_KEY, roles);
};
