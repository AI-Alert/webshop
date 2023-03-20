import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679316971940 implements MigrationInterface {
    name = 'migration1679316971940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_2ca008a558fe6002e3309f8f1d7"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cartId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_2ca008a558fe6002e3309f8f1d7" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_2ca008a558fe6002e3309f8f1d7"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cartId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_2ca008a558fe6002e3309f8f1d7" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
