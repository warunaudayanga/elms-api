import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Role } from "./role.entity";
import { Profile } from "../../../elms/modules/profile/entities/profile.entity";
import { Status } from "../../../core/enums";

@Unique("USERNAME", ["username"])
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

    @ManyToOne(() => Role, (role) => role.users)
    role?: Role;

    @OneToOne(() => Profile, { cascade: ["insert", "remove", "soft-remove"], onDelete: "CASCADE" })
    @JoinColumn()
    profile?: Profile;

    @Column({ type: "enum", enum: Status, default: Status.INACTIVE })
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
}
