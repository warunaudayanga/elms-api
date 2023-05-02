import { IsNotEmpty } from "class-validator";
import { QuizAnswer } from "../interfaces/quiz.interfaces";

export class SubmitAssessmentDto {
    @IsNotEmpty()
    answers?: QuizAnswer[];
}
