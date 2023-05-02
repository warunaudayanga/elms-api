import { IsNotEmpty } from "class-validator";
import { QuizAnswer } from "../interfaces/quiz.interfaces";

export class UpdateAssessmentSubmissionDto {
    @IsNotEmpty()
    answers: QuizAnswer[];
}
