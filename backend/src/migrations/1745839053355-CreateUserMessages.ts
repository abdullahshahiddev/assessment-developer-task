import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserMessages1745839053355 implements MigrationInterface {
    name = 'CreateUserMessages1745839053355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user_message\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`message\` varchar(255) NOT NULL,
                \`items\` text NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`user_message\`
        `);
    }

}
