import { MigrationInterface, QueryRunner } from "typeorm";

export class verificationEntity1683110932134 implements MigrationInterface {
    name = 'verificationEntity1683110932134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`verifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`type\` enum ('email') NOT NULL, \`userId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`verifications\` ADD CONSTRAINT \`FK_verification_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verifications\` DROP FOREIGN KEY \`FK_verification_user\``);
        await queryRunner.query(`DROP TABLE \`verifications\``);
    }

}
