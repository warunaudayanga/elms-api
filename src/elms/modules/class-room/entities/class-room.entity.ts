import { BaseEntity } from "../../../../core/entity/base.entity";
import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { Grade } from "./grade.entity";
import { ClassSubject } from "./subject.entity";
import { User } from "../../../../modules/auth/entities";
import { ClassStudent } from "./class-students.entity";
import { ClassSchedule } from "./schedule.entity";
import { ChatRoom } from "./chat-room.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { Assessment } from "./assessment.entity";

@Entity({ name: "classes" })
export class ClassRoom {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    payment: number;

    @Column({ type: "json", nullable: true })
    // eslint-disable-next-line no-use-before-define
    changeRequest?: Omit<Partial<ClassRoom>, "changeRequest" | keyof BaseEntity>;

    @Column({ nullable: true })
    gradeId: number;

    @Column({ nullable: true })
    subjectId: number;

    @Column({ nullable: true })
    tutorId: number;

    @Column({ nullable: true })
    scheduleId?: number;

    @ManyToOne(() => Grade, (grade) => grade.classRooms)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_ROOM_GRADE })
    grade?: Grade;

    @ManyToOne(() => ClassSubject, (subject) => subject.classRooms)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_ROOM_SUBJECT })
    subject?: ClassSubject;

    @ManyToOne(() => User, (tutor) => tutor.classRooms)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_ROOM_TUTOR })
    tutor?: User;

    @OneToOne(() => ClassSchedule)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_ROOM_SCHEDULE })
    schedule?: ClassSchedule;

    @OneToMany(() => ClassStudent, (classStudents) => classStudents.classRoom)
    classStudents?: ClassStudent[];

    @OneToMany(() => Assessment, (assessments) => assessments.classRoom)
    assessments?: Assessment[];

    @OneToOne(() => ChatRoom, (chatRoom) => chatRoom.classRoom)
    chatRoom?: ChatRoom;

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

    isPaid?: boolean;
}
