import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    userId: number;
}
