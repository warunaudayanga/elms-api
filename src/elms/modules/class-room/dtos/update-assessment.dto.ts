import { IsOptional } from "class-validator";
import { Quiz, QuizAnswer } from "../interfaces/quiz.interfaces";

export class UpdateAssessmentDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    quizzes?: Quiz[];

    @IsOptional()
    answers?: QuizAnswer[];

    @IsOptional()
    passMarks?: number;
}
