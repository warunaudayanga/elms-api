import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { User } from "../../../../modules/auth/entities";
import { ClassSubject } from "./subject.entity";
import { ClassRoom } from "./class-room.entity";

@Entity({ name: "tutors" })
export class Tutor {
    @OneToOne(() => User, (user) => user.tutor)
    user?: User;

    @ManyToMany(() => ClassSubject, (subject) => subject.tutors)
    subjects?: ClassSubject[];

    @OneToMany(() => ClassRoom, (classRoom) => classRoom.tutor)
    classRooms?: ClassRoom[];

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
