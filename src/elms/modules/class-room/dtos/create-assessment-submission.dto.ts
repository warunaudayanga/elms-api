import { IsNotEmpty } from "class-validator";
import { QuizAnswer } from "../interfaces/quiz.interfaces";

export class CreateAssessmentSubmissionDto {
    @IsNotEmpty()
    answers: QuizAnswer[];

    @IsNotEmpty()
    assessmentId?: number;
}
