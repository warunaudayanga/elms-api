import { IsNotEmpty } from "class-validator";
import { AuthErrors } from "../responses";
import { toErrString } from "src/core/converters";

export class VerificationDto {
    @IsNotEmpty(toErrString(AuthErrors.AUTH_400_EMPTY_TOKEN))
    token: string;
}
