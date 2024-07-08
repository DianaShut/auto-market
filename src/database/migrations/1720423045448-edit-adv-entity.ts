import { MigrationInterface, QueryRunner } from "typeorm";

export class EditAdvEntity1720423045448 implements MigrationInterface {
    name = 'EditAdvEntity1720423045448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisements" ADD "priceFunc" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisements" DROP COLUMN "priceFunc"`);
    }

}
