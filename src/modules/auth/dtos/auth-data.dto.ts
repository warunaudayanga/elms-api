import { IsNotEmpty } from "class-validator";
import { AuthErrors } from "../responses";
import { toErrString } from "src/core/converters";

export class AuthDataDto {
    @IsNotEmpty(toErrString(AuthErrors.AUTH_400_EMPTY_UNAME))
    username: string;

    @IsNotEmpty(toErrString(AuthErrors.AUTH_400_EMPTY_PASSWORD))
    password: string;
}
