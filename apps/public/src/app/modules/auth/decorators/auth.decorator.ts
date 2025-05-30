import { SetMetadata } from "@nestjs/common";
import { AuthType } from "@nestjs-booking-clone/common";

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authType: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authType);