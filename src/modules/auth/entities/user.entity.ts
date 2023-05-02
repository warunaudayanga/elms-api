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
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Status } from "../../../core/enums";
import { GuardianRelationship } from "../../../elms/modules/class-room/enums";
import {
    ClassRoom,
    ClassStudent,
    Tutor,
    Area,
    MessageUserStatus,
    AssessmentSubmission,
} from "../../../elms/modules/class-room/entities";
import { Role } from "../enums";
import { FKConstraint, UNIQUEConstraint } from "../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.USER_USERNAME, ["username"])
@Unique(UNIQUEConstraint.USER_EMAIL, ["email"])
@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: false })
    username: string;

    @Column({ nullable: false })
    @Exclude()
    password?: string;

    @Column({ nullable: false })
    @Exclude()
    salt?: string;

    @Column({ length: 20, nullable: false })
    firstName: string;

    @Column({ length: 20, nullable: false })
    lastName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ type: "enum", enum: Role, nullable: false })
    role: Role;

    @Column({ nullable: true })
    dob?: Date;

    @Column({ length: 20, nullable: false })
    phone: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: true })
    guardianName?: string;

    @Column({ nullable: true })
    guardianPhone?: string;

    @Column({ nullable: true })
    guardianAddress?: string;

    @Column({ type: "enum", enum: GuardianRelationship, nullable: true })
    guardianRelationship?: GuardianRelationship;

    @Column({ nullable: true })
    school?: string;

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({ nullable: true })
    roleId?: number;

    @Column({ nullable: true })
    areaId?: number;

    @Column({ nullable: true })
    tutorId?: number;

    @ManyToOne(() => Area, (area) => area.users)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.USER_AREA })
    area?: Area;

    @OneToOne(() => Tutor, (tutor) => tutor.user)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.USER_TUTOR })
    tutor?: Tutor;

    @OneToMany(() => ClassRoom, (classRoom) => classRoom.tutor)
    classRooms?: ClassRoom[];

    @OneToMany(() => ClassStudent, (classStudents) => classStudents.student)
    classStudents?: ClassStudent[];

    @OneToMany(() => MessageUserStatus, (messageUserStatus) => messageUserStatus.reader)
    messageUserStatus?: MessageUserStatus[];

    @OneToMany(() => AssessmentSubmission, (assessmentSubmission) => assessmentSubmission.student)
    assessmentSubmissions?: AssessmentSubmission[];

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status: Status | string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    // eslint-disable-next-line no-use-before-define
    createdBy?: User;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    // eslint-disable-next-line no-use-before-define
    updatedBy?: User;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User)
    // eslint-disable-next-line no-use-before-define
    deletedBy?: User;

    name: string;

    @AfterLoad()
    getName?(): string {
        this.name = `${this.firstName} ${this.lastName}`;
        return this.name;
    }

    @AfterLoad()
    afterLoad?(): void {
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
