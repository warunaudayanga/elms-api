import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/modules/auth/entities/user.entity";

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    user.password = undefined;
    user.salt = undefined;
    return user;
});
