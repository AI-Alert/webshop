import { MigrationInterface, QueryRunner } from "typeorm"

export class migration1679057163723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`insert into admin("firstName", "lastName", email, "passwordHash", "passwordSalt") values ('admin', 'admin', 'admin@admin.com', 'Admin12345', '')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
