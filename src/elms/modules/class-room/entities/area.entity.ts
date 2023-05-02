import { Column, Entity, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { User } from "../../../../modules/auth/entities";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.AREA_NAME, ["name"])
@Entity({ name: "areas" })
export class Area extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @OneToMany(() => User, (user) => user.area)
    users?: User[];
}
