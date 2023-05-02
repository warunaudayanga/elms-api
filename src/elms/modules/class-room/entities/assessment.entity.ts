import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ClassRoom } from "./class-room.entity";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { Quiz, QuizAnswer } from "../interfaces/quiz.interfaces";
import { AssessmentSubmission } from "./assessment-submissions.entity";

@Entity({ name: "assessments" })
export class Assessment extends BaseEntity {
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
}
