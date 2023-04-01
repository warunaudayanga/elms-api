import { AfterLoad, Column, PrimaryGeneratedColumn } from "typeorm";

export class BaseProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, nullable: false })
    firstName: string;

    @Column({ length: 20, nullable: false })
    lastName: string;

    @Column({ nullable: true })
    email?: string;

    name: string;

    @AfterLoad()
    getName(): string {
        this.name = `${this.firstName} ${this.lastName}`;
        return this.name;
    }
}
