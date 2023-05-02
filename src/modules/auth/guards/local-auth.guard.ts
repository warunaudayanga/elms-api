// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthErrors } from "../responses";
import { User } from "../entities";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleRequest(err: any, user: User, info: any): any {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException(AuthErrors.AUTH_401_NOT_LOGGED_IN);
        }
        delete user.password;
        delete user.salt;
        return user;
    }
}
