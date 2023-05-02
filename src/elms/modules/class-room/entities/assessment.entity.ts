import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { User } from "../../../../modules/auth/entities";
import { ClassRoom } from "./class-room.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { Quiz, QuizAnswer } from "../interfaces/quiz.interfaces";
import { AssessmentSubmission } from "./assessment-submissions.entity";

@Entity({ name: "assessments" })
export class Assessment {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: "json", nullable: true })
    quizzes?: Quiz[];

    @Column({ type: "json", nullable: true })
    answers?: QuizAnswer[];

    @Column({ nullable: true })
    passMarks?: number;

    @Column({ nullable: true })
    startTime: Date;

    @Column({ nullable: true })
    endTime: Date;

    @Column({ nullable: true })
    classRoomId?: number;

    @ManyToOne(() => ClassRoom, (classRoom) => classRoom.assessments)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_ROOM_ASSESSMENT })
    classRoom?: ClassRoom;

    @OneToMany(() => AssessmentSubmission, (submission) => submission.assessment)
    submissions?: AssessmentSubmission[];

    submission?: AssessmentSubmission;

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
