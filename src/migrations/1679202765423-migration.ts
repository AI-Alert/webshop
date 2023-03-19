import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679202765423 implements MigrationInterface {
    name = 'migration1679202765423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c4dd8e21a4e8131d8a66e430c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c4dd8e21a4e8131d8a66e430c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_6c4dd8e21a4e8131d8a66e430c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_6c4dd8e21a4e8131d8a66e430c" UNIQUE ("verificationId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6c4dd8e21a4e8131d8a66e430c" ON "user" ("verificationId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6c4dd8e21a4e8131d8a66e430c0" FOREIGN KEY ("verificationId") REFERENCES "userVerification"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
