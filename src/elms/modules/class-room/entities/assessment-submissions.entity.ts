import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { User } from "../../../../modules/auth/entities";
import { QuizAnswer } from "../interfaces/quiz.interfaces";
import { Assessment } from "./assessment.entity";

@Entity({ name: "assessments_submissions" })
export class AssessmentSubmission extends BaseEntity {
    @Column({ type: "json", nullable: false })
    answers: QuizAnswer[];

    @Column({ nullable: true })
    marks?: number;

    @Column({ nullable: true })
    assessmentId?: number;

    @Column({ nullable: true })
    studentId?: number;

    @ManyToOne(() => Assessment, (assessment) => assessment.submissions)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.ASSESSMENT_SUBMISSION_ASSESSMENT })
    assessment?: Assessment;

    @ManyToOne(() => User, (user) => user.assessmentSubmissions)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.ASSESSMENT_SUBMISSION_USER })
    student?: User;
}
