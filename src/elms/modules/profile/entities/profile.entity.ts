import { Entity } from "typeorm";
import { BaseProfile } from "../../../../modules/auth/entities/base-profile.entity";

@Entity({ name: "profile" })
export class Profile extends BaseProfile {}
