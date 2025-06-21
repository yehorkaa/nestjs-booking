import { AUTH_TYPE } from "@nestjs-booking-clone/common";
import { Controller } from "@nestjs/common";
import { Auth } from "../decorators/auth.decorator";

@Auth(AUTH_TYPE.NONE)
@Controller('auth/user/property-owner')
export class PropertyOwnerAuthController {}