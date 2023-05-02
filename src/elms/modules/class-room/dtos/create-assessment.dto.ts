import { IsNotEmpty, IsOptional } from "class-validator";
import { Quiz, QuizAnswer } from "../interfaces/quiz.interfaces";

export class CreateAssessmentDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    quizzes?: Quiz[];

    @IsOptional()
    answers?: QuizAnswer[];

    @IsOptional()
    passMarks?: number;
}
