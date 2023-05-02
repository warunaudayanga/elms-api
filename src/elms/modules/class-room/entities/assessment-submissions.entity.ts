import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { User } from "../../../../modules/auth/entities";
import { QuizAnswer } from "../interfaces/quiz.interfaces";
import { Assessment } from "./assessment.entity";

@Entity({ name: "assessments_submissions" })
export class AssessmentSubmission {
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

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status: Status | string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    createdBy?: User;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    updatedBy?: User;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User)
    deletedBy?: User;

    @AfterLoad()
    afterLoad(): void {
        this.createdBy = this.createdBy
            ? ({
                  id: this.createdBy.id,
                  firstName: this.createdBy.firstName,
                  lastName: this.createdBy.lastName,
              } as User)
            : null;
        this.updatedBy = this.updatedBy
            ? ({
                  id: this.updatedBy.id,
                  firstName: this.updatedBy.firstName,
                  lastName: this.updatedBy.lastName,
              } as User)
            : null;
        this.deletedBy = this.deletedBy
            ? ({
                  id: this.deletedBy.id,
                  firstName: this.deletedBy.firstName,
                  lastName: this.deletedBy.lastName,
              } as User)
            : null;
    }
}
