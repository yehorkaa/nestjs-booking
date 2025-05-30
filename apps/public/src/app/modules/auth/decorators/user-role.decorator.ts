import { SetMetadata } from "@nestjs/common";
import { User } from "../../user/entities/user.entity";

export const USER_ROLE_KEY = 'userRole';
export const UserRole = (roles: User['role'][]) => {
    return SetMetadata(USER_ROLE_KEY, roles);
}