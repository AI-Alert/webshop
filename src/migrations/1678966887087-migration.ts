import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1678966887087 implements MigrationInterface {
    name = 'migration1678966887087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "userVerification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "passwordVerificationCode" character varying, "lastPasswordVerificationCodeSentAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_71522ed088193b35ec1c8870bc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "photoUrl" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "contactName" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying, "address" character varying, "websiteUrl" character varying, "passwordHash" character varying, "lastPasswordResetDate" TIMESTAMP, "deletedAt" TIMESTAMP, "verificationId" integer NOT NULL, CONSTRAINT "REL_6c4dd8e21a4e8131d8a66e430c" UNIQUE ("verificationId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c4dd8e21a4e8131d8a66e430c" ON "user" ("verificationId") `);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordSalt" character varying NOT NULL, "status" character varying, "deletedAt" TIMESTAMP, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6c4dd8e21a4e8131d8a66e430c0" FOREIGN KEY ("verificationId") REFERENCES "userVerification"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c4dd8e21a4e8131d8a66e430c0"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c4dd8e21a4e8131d8a66e430c"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "userVerification"`);
    }

}
