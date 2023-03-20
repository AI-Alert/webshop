import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679294417682 implements MigrationInterface {
    name = 'migration1679294417682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "advantage" character varying NOT NULL, "disadvantage" character varying NOT NULL, "comment" character varying NOT NULL, "rate" integer NOT NULL, "deletedAt" TIMESTAMP, "productId" integer NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2a11d3c0ea1b2b5b1790f762b9" ON "review" ("productId") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a11d3c0ea1b2b5b1790f762b9"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
