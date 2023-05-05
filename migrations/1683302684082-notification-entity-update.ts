import { MigrationInterface, QueryRunner } from "typeorm";

export class notificationEntityUpdate1683302684082 implements MigrationInterface {
    name = 'notificationEntityUpdate1683302684082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`metadata\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`metadata\``);
    }

}
