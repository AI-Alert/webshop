import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679209887307 implements MigrationInterface {
    name = 'migration1679209887307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "brandId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_bb7d3d9dc1fae40293795ae39d" ON "product" ("brandId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff0c0301a95e517153df97f681" ON "product" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff0c0301a95e517153df97f681"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb7d3d9dc1fae40293795ae39d"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brandId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "brand" character varying NOT NULL`);
    }

}
