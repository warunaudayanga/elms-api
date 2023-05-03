import { IsNotEmpty } from "class-validator";
import { AuthErrors } from "../responses";
import { toErrString } from "src/core/converters";

export class ResendVerificationDto {
    @IsNotEmpty(toErrString(AuthErrors.AUTH_400_EMPTY_EMAIL))
    email: string;
}
