import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../auth.const";
import { PublicUserRole } from "@nestjs-booking-clone/common";

export interface ActiveUserModel {
    sub: string;
    email: string;
    roles: PublicUserRole[];
}

export const ActiveUser = createParamDecorator(
    (field: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const activeUser: ActiveUserModel = request[REQUEST_USER_KEY];
        return field ? activeUser?.[field] : activeUser;
    },
);