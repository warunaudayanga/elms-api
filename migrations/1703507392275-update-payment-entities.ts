import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentEntities1703507392275 implements MigrationInterface {
    name = 'UpdatePaymentEntities1703507392275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_payment_classStudents\``);
        await queryRunner.query(`CREATE TABLE \`class_payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`classStudentId\` int NULL, \`classRoomId\` int NULL, \`paymentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`classStudentId\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`stripeData\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`paymentResponse\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`status\` \`status\` enum ('paid', 'pending', 'canceled', 'failed') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_payment\` ADD CONSTRAINT \`FK_classPayment_classStudent\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_payment\` ADD CONSTRAINT \`FK_classPayment_classRoom\` FOREIGN KEY (\`classRoomId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_payment\` ADD CONSTRAINT \`FK_classPayment_payment\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`class_payment\` DROP FOREIGN KEY \`FK_classPayment_payment\``);
        await queryRunner.query(`ALTER TABLE \`class_payment\` DROP FOREIGN KEY \`FK_classPayment_classRoom\``);
        await queryRunner.query(`ALTER TABLE \`class_payment\` DROP FOREIGN KEY \`FK_classPayment_classStudent\``);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`status\` \`status\` enum ('PENDING', 'PAID', 'FAILED') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`paymentResponse\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`stripeData\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`classStudentId\` int NULL`);
        await queryRunner.query(`DROP TABLE \`class_payment\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_payment_classStudents\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
