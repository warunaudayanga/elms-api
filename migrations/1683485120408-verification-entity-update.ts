import { MigrationInterface, QueryRunner } from "typeorm";

export class verificationEntityUpdate1683485120408 implements MigrationInterface {
    name = 'verificationEntityUpdate1683485120408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verifications\` CHANGE \`type\` \`type\` enum ('email', 'password_reset') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verifications\` CHANGE \`type\` \`type\` enum ('email') NOT NULL`);
    }

}
