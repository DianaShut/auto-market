import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEntity1719847592871 implements MigrationInterface {
    name = 'AddUserEntity1719847592871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('user', 'seller', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_accounttype_enum" AS ENUM('free', 'premium')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text, "email" text NOT NULL, "deviceId" text NOT NULL, "password" text NOT NULL, "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'user', "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'free', "blocked" boolean NOT NULL DEFAULT false, "image" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    }

}
