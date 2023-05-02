import { IsNotEmpty } from "class-validator";

// TODO;
export class GenerateTokenDto {
    @IsNotEmpty()
    code: number;

    @IsNotEmpty()
    redirectUri: string;
}
