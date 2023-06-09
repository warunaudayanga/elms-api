import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1683007413995 implements MigrationInterface {
    name = 'initial1683007413995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`areas\` (\`name\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`UNIQUE_area_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`grades\` (\`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`UNIQUE_grade_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tutors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subjects\` (\`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`UNIQUE_subject_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL, \`transactionId\` varchar(255) NOT NULL, \`fromDate\` date NOT NULL, \`toDate\` date NOT NULL, \`status\` enum ('PENDING', 'PAID', 'FAILED') NOT NULL, \`stripeData\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`classStudentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`class_students\` (\`classRoomId\` int NULL, \`studentId\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`UNIQUE_classStudent_classRoom_student\` (\`classRoomId\`, \`studentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schedule_histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day\` enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`status\` enum ('HELD', 'CANCELLED') NOT NULL, \`scheduleId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`REL_ea2f11d931b2d08167056594d1\` (\`scheduleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schedules\` (\`day\` enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`meetingId\` bigint NULL, \`joinUrl\` varchar(255) NULL, \`changeRequest\` json NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages_user_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('SENT', 'DELIVERED', 'SEEN') NOT NULL DEFAULT 'SENT', \`messageId\` int NULL, \`readerId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UNIQUE_messagesUserStatus_message_reader\` (\`messageId\`, \`readerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` longtext NOT NULL, \`type\` enum ('NORMAL', 'TUTOR', 'ADMIN', 'SYSTEM') NOT NULL DEFAULT 'NORMAL', \`senderId\` int NULL, \`chatRoomId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_rooms\` (\`name\` varchar(255) NULL, \`classRoomId\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`REL_879fdc0a6d557a2004e787f431\` (\`classRoomId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classes\` (\`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`payment\` decimal(10,2) NOT NULL, \`changeRequest\` json NULL, \`gradeId\` int NULL, \`subjectId\` int NULL, \`tutorId\` int NULL, \`scheduleId\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`REL_91054512e592e2728e9a5dd39f\` (\`scheduleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`assessments\` (\`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`quizzes\` json NULL, \`answers\` json NULL, \`passMarks\` int NULL, \`startTime\` datetime NULL, \`endTime\` datetime NULL, \`classRoomId\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`assessments_submissions\` (\`answers\` json NOT NULL, \`marks\` int NULL, \`assessmentId\` int NULL, \`studentId\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`salt\` varchar(255) NOT NULL, \`firstName\` varchar(20) NOT NULL, \`lastName\` varchar(20) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('SUPER_ADMIN', 'ADMIN', 'TUTOR', 'STUDENT') NOT NULL, \`dob\` datetime NULL, \`phone\` varchar(20) NOT NULL, \`address\` varchar(255) NOT NULL, \`guardianName\` varchar(255) NULL, \`guardianPhone\` varchar(255) NULL, \`guardianAddress\` varchar(255) NULL, \`guardianRelationship\` enum ('Father', 'Mother', 'GrandFather', 'GrandMother', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Other') NULL, \`school\` varchar(255) NULL, \`profilePicture\` varchar(255) NULL, \`roleId\` int NULL, \`areaId\` int NULL, \`tutorId\` int NULL, \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdById\` int NULL, \`updatedById\` int NULL, \`deletedById\` int NULL, UNIQUE INDEX \`UNIQUE_user_email\` (\`email\`), UNIQUE INDEX \`UNIQUE_user_username\` (\`username\`), UNIQUE INDEX \`REL_bc517d19a73218765f2fa9dafd\` (\`tutorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_room_users\` (\`chatRoomsId\` int NOT NULL, \`usersId\` int NOT NULL, INDEX \`IDX_4bcde624b7986ad06a91fb239a\` (\`chatRoomsId\`), INDEX \`IDX_0ac67d5afef5989a6ffca3c0b4\` (\`usersId\`), PRIMARY KEY (\`chatRoomsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`areas\` ADD CONSTRAINT \`FK_8573a88abe4727ade3b77c2dff8\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`areas\` ADD CONSTRAINT \`FK_883659de7534698db7352d05d2f\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`areas\` ADD CONSTRAINT \`FK_f5ea4902c7c68c7e52f8f611b21\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_74a39119f5b12f1f2b17c13cb9e\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_4e78a86023cf261207b1c1e6c63\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_c1b8c40d89361f7600f7883c405\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tutors\` ADD CONSTRAINT \`FK_aba9e1f26819344bb0e7bcea049\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tutors\` ADD CONSTRAINT \`FK_8e520061539df4317c8c6ea23a4\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tutors\` ADD CONSTRAINT \`FK_5801a574ffffd7202e68b1a8d67\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD CONSTRAINT \`FK_dde0f93208e57c8603673bfdf46\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD CONSTRAINT \`FK_704ca2294865020cc9464ffe4bb\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD CONSTRAINT \`FK_ec9e1310e2f31513c12b2ad265c\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_payment_classStudents\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_students\` ADD CONSTRAINT \`FK_classStudents_classRoom\` FOREIGN KEY (\`classRoomId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_students\` ADD CONSTRAINT \`FK_classStudents_student\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_students\` ADD CONSTRAINT \`FK_cbafdcf6e67c6c28993df8f1eb6\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_students\` ADD CONSTRAINT \`FK_3c946480d084c9575e18196d55a\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_students\` ADD CONSTRAINT \`FK_1e0daf8f7adac0cbf7344bd42b0\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` ADD CONSTRAINT \`FK_scheduleHistory_schedule\` FOREIGN KEY (\`scheduleId\`) REFERENCES \`schedules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` ADD CONSTRAINT \`FK_7637e561ef90097eeb9dd19e449\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` ADD CONSTRAINT \`FK_b87924987e4253b0766607a310a\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` ADD CONSTRAINT \`FK_244be84f9afc98bfc7a12afc387\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_de50f08bc143c26d6e245675708\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_ce2a4f575e01d029c4d3dfbce4f\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_4b176b0b60bd5360e2a39bde558\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages_user_status\` ADD CONSTRAINT \`FK_7552e68547421a6ab38a2b9e15f\` FOREIGN KEY (\`messageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages_user_status\` ADD CONSTRAINT \`FK_e9655bc0fc088991ffa10565ed2\` FOREIGN KEY (\`readerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2db9cf2b3ca111742793f6c37ce\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_05cc073f1a70e468e3ee1b4ba98\` FOREIGN KEY (\`chatRoomId\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_879fdc0a6d557a2004e787f431e\` FOREIGN KEY (\`classRoomId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_8e4fbc0dfa5e3ef7b7c4e65ea5d\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_c47f0bd2b768dd0ea4d1c5667ad\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_7378e1b9522e74ae53c739337b4\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_classRoom_grade\` FOREIGN KEY (\`gradeId\`) REFERENCES \`grades\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_classRoom_subject\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_classRoom_tutor\` FOREIGN KEY (\`tutorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_classRoom_schedule\` FOREIGN KEY (\`scheduleId\`) REFERENCES \`schedules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_38f8de3ee0fa4d0342572070dd7\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_59e2bc140eec68523ba8976d9c1\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_700aa9cf02b4a34b5ed20e2a7cc\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments\` ADD CONSTRAINT \`FK_classRoom_assessment\` FOREIGN KEY (\`classRoomId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments\` ADD CONSTRAINT \`FK_9e6d5a430670a67c387bf424212\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments\` ADD CONSTRAINT \`FK_37424a7da0ff26601aa4ea9257e\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments\` ADD CONSTRAINT \`FK_5243bd59c3a465f21807809dace\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` ADD CONSTRAINT \`FK_assessmentSubmission_assessment\` FOREIGN KEY (\`assessmentId\`) REFERENCES \`assessments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` ADD CONSTRAINT \`FK_assessmentSubmission_user\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` ADD CONSTRAINT \`FK_c0605282d1972f0decaf21ab487\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` ADD CONSTRAINT \`FK_0e501f852b7a35f5b7c5954272b\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` ADD CONSTRAINT \`FK_41f97e9fe01a52a9f1a66f8a224\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_user_area\` FOREIGN KEY (\`areaId\`) REFERENCES \`areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_user_tutor\` FOREIGN KEY (\`tutorId\`) REFERENCES \`tutors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_51d635f1d983d505fb5a2f44c52\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_52e97c477859f8019f3705abd21\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_e9d50c91bd84f566ce0ac1acf44\` FOREIGN KEY (\`deletedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_room_users\` ADD CONSTRAINT \`FK_4bcde624b7986ad06a91fb239a8\` FOREIGN KEY (\`chatRoomsId\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`chat_room_users\` ADD CONSTRAINT \`FK_0ac67d5afef5989a6ffca3c0b43\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_room_users\` DROP FOREIGN KEY \`FK_0ac67d5afef5989a6ffca3c0b43\``);
        await queryRunner.query(`ALTER TABLE \`chat_room_users\` DROP FOREIGN KEY \`FK_4bcde624b7986ad06a91fb239a8\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_e9d50c91bd84f566ce0ac1acf44\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_52e97c477859f8019f3705abd21\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_51d635f1d983d505fb5a2f44c52\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_user_tutor\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_user_area\``);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` DROP FOREIGN KEY \`FK_41f97e9fe01a52a9f1a66f8a224\``);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` DROP FOREIGN KEY \`FK_0e501f852b7a35f5b7c5954272b\``);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` DROP FOREIGN KEY \`FK_c0605282d1972f0decaf21ab487\``);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` DROP FOREIGN KEY \`FK_assessmentSubmission_user\``);
        await queryRunner.query(`ALTER TABLE \`assessments_submissions\` DROP FOREIGN KEY \`FK_assessmentSubmission_assessment\``);
        await queryRunner.query(`ALTER TABLE \`assessments\` DROP FOREIGN KEY \`FK_5243bd59c3a465f21807809dace\``);
        await queryRunner.query(`ALTER TABLE \`assessments\` DROP FOREIGN KEY \`FK_37424a7da0ff26601aa4ea9257e\``);
        await queryRunner.query(`ALTER TABLE \`assessments\` DROP FOREIGN KEY \`FK_9e6d5a430670a67c387bf424212\``);
        await queryRunner.query(`ALTER TABLE \`assessments\` DROP FOREIGN KEY \`FK_classRoom_assessment\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_700aa9cf02b4a34b5ed20e2a7cc\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_59e2bc140eec68523ba8976d9c1\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_38f8de3ee0fa4d0342572070dd7\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_classRoom_schedule\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_classRoom_tutor\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_classRoom_subject\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_classRoom_grade\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_7378e1b9522e74ae53c739337b4\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_c47f0bd2b768dd0ea4d1c5667ad\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_8e4fbc0dfa5e3ef7b7c4e65ea5d\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_879fdc0a6d557a2004e787f431e\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_05cc073f1a70e468e3ee1b4ba98\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2db9cf2b3ca111742793f6c37ce\``);
        await queryRunner.query(`ALTER TABLE \`messages_user_status\` DROP FOREIGN KEY \`FK_e9655bc0fc088991ffa10565ed2\``);
        await queryRunner.query(`ALTER TABLE \`messages_user_status\` DROP FOREIGN KEY \`FK_7552e68547421a6ab38a2b9e15f\``);
        await queryRunner.query(`ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_4b176b0b60bd5360e2a39bde558\``);
        await queryRunner.query(`ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_ce2a4f575e01d029c4d3dfbce4f\``);
        await queryRunner.query(`ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_de50f08bc143c26d6e245675708\``);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` DROP FOREIGN KEY \`FK_244be84f9afc98bfc7a12afc387\``);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` DROP FOREIGN KEY \`FK_b87924987e4253b0766607a310a\``);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` DROP FOREIGN KEY \`FK_7637e561ef90097eeb9dd19e449\``);
        await queryRunner.query(`ALTER TABLE \`schedule_histories\` DROP FOREIGN KEY \`FK_scheduleHistory_schedule\``);
        await queryRunner.query(`ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_1e0daf8f7adac0cbf7344bd42b0\``);
        await queryRunner.query(`ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_3c946480d084c9575e18196d55a\``);
        await queryRunner.query(`ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_cbafdcf6e67c6c28993df8f1eb6\``);
        await queryRunner.query(`ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_classStudents_student\``);
        await queryRunner.query(`ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_classStudents_classRoom\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_payment_classStudents\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP FOREIGN KEY \`FK_ec9e1310e2f31513c12b2ad265c\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP FOREIGN KEY \`FK_704ca2294865020cc9464ffe4bb\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP FOREIGN KEY \`FK_dde0f93208e57c8603673bfdf46\``);
        await queryRunner.query(`ALTER TABLE \`tutors\` DROP FOREIGN KEY \`FK_5801a574ffffd7202e68b1a8d67\``);
        await queryRunner.query(`ALTER TABLE \`tutors\` DROP FOREIGN KEY \`FK_8e520061539df4317c8c6ea23a4\``);
        await queryRunner.query(`ALTER TABLE \`tutors\` DROP FOREIGN KEY \`FK_aba9e1f26819344bb0e7bcea049\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_c1b8c40d89361f7600f7883c405\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_4e78a86023cf261207b1c1e6c63\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_74a39119f5b12f1f2b17c13cb9e\``);
        await queryRunner.query(`ALTER TABLE \`areas\` DROP FOREIGN KEY \`FK_f5ea4902c7c68c7e52f8f611b21\``);
        await queryRunner.query(`ALTER TABLE \`areas\` DROP FOREIGN KEY \`FK_883659de7534698db7352d05d2f\``);
        await queryRunner.query(`ALTER TABLE \`areas\` DROP FOREIGN KEY \`FK_8573a88abe4727ade3b77c2dff8\``);
        await queryRunner.query(`DROP INDEX \`IDX_0ac67d5afef5989a6ffca3c0b4\` ON \`chat_room_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_4bcde624b7986ad06a91fb239a\` ON \`chat_room_users\``);
        await queryRunner.query(`DROP TABLE \`chat_room_users\``);
        await queryRunner.query(`DROP INDEX \`REL_bc517d19a73218765f2fa9dafd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_user_username\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_user_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`assessments_submissions\``);
        await queryRunner.query(`DROP TABLE \`assessments\``);
        await queryRunner.query(`DROP INDEX \`REL_91054512e592e2728e9a5dd39f\` ON \`classes\``);
        await queryRunner.query(`DROP TABLE \`classes\``);
        await queryRunner.query(`DROP INDEX \`REL_879fdc0a6d557a2004e787f431\` ON \`chat_rooms\``);
        await queryRunner.query(`DROP TABLE \`chat_rooms\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_messagesUserStatus_message_reader\` ON \`messages_user_status\``);
        await queryRunner.query(`DROP TABLE \`messages_user_status\``);
        await queryRunner.query(`DROP TABLE \`schedules\``);
        await queryRunner.query(`DROP INDEX \`REL_ea2f11d931b2d08167056594d1\` ON \`schedule_histories\``);
        await queryRunner.query(`DROP TABLE \`schedule_histories\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_classStudent_classRoom_student\` ON \`class_students\``);
        await queryRunner.query(`DROP TABLE \`class_students\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_subject_name\` ON \`subjects\``);
        await queryRunner.query(`DROP TABLE \`subjects\``);
        await queryRunner.query(`DROP TABLE \`tutors\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_grade_name\` ON \`grades\``);
        await queryRunner.query(`DROP TABLE \`grades\``);
        await queryRunner.query(`DROP INDEX \`UNIQUE_area_name\` ON \`areas\``);
        await queryRunner.query(`DROP TABLE \`areas\``);
    }

}
