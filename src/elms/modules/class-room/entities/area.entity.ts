import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { User } from "../../../../modules/auth/entities";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.AREA_NAME, ["name"])
@Entity({ name: "areas" })
export class Area {
    @Column({ nullable: false })
    name: string;

    @OneToMany(() => User, (user) => user.area)
    users?: User[];

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
