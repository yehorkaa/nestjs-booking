import { SetMetadata } from '@nestjs/common';
import { PublicUserRole } from '@nestjs-booking-clone/common';

export const USER_ROLES_KEY = 'user-roles';
export const UserRoles = (...roles: PublicUserRole[]) => {
  return SetMetadata(USER_ROLES_KEY, roles);
};