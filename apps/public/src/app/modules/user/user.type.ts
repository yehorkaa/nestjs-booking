import { USER_PROVIDERS, USER_ROLES } from './user.const';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserRoleKey = keyof typeof USER_ROLES;

export type UserProvider = (typeof USER_PROVIDERS)[keyof typeof USER_PROVIDERS];
export type UserProviderKey = keyof typeof USER_PROVIDERS;
