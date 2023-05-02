import { Injectable } from "@nestjs/common";
import { User } from "../entities";
import { AuthService } from "../services";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    // noinspection JSUnusedGlobalSymbols
    async validate(username: string, password: string): Promise<User> {
        return await this.authService.authenticate(username, password);
    }
}
