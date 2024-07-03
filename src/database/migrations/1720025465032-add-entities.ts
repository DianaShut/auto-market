import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntities1720025465032 implements MigrationInterface {
    name = 'AddEntities1720025465032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."currency_currency_enum" AS ENUM('usd', 'eur', 'uah')`);
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "currency" "public"."currency_currency_enum" NOT NULL DEFAULT 'uah', "buying" numeric(10,2) NOT NULL, "selling" numeric(10,2) NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "brand" text NOT NULL, CONSTRAINT "UQ_b26b9a97a273f725e0735a34cb5" UNIQUE ("brand"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "photoUrl" text NOT NULL, "advertisement_id" uuid NOT NULL, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."regions_region_enum" AS ENUM('Cherkasy', 'Chernihiv', 'Chernivtsi', 'Dnipro', 'Donetsk', 'Ivano-Frankivsk', 'Kharkiv', 'Kherson', 'Khmelnytskyi', 'Kyiv', 'Kirovohrad', 'Luhansk', 'Lviv', 'Mykolaiv', 'Odesa', 'Poltava', 'Rivne', 'Sumy', 'Ternopil', 'Vinnytsia', 'Volyn', 'Zakarpattia', 'Zaporizhzhia', 'Zhytomyr', 'Krym', 'Unspecified')`);
        await queryRunner.query(`CREATE TABLE "regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "region" "public"."regions_region_enum" NOT NULL DEFAULT 'Unspecified', CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "views" TIMESTAMP NOT NULL DEFAULT now(), "advertisement_id" uuid NOT NULL, CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advertisements_currency_enum" AS ENUM('usd', 'eur', 'uah')`);
        await queryRunner.query(`CREATE TYPE "public"."advertisements_isvalidate_enum" AS ENUM('not active', 'active')`);
        await queryRunner.query(`CREATE TABLE "advertisements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text NOT NULL, "brand_Id" uuid NOT NULL, "model_Id" uuid NOT NULL, "year" integer NOT NULL, "price" numeric NOT NULL, "region_Id" uuid NOT NULL, "currency" "public"."advertisements_currency_enum" NOT NULL DEFAULT 'uah', "isValidate" "public"."advertisements_isvalidate_enum" NOT NULL DEFAULT 'not active', "user_id" uuid NOT NULL, CONSTRAINT "PK_4818a08332624787e5b2bf82302" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "model" text NOT NULL, "brand_id" uuid NOT NULL, CONSTRAINT "UQ_98947c55f3856eee369f2ca8207" UNIQUE ("model"), CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_f3c154ad4ddaccab7f3cbe92d44" FOREIGN KEY ("advertisement_id") REFERENCES "advertisements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_e1bfabe4399da1bce5c97c918ae" FOREIGN KEY ("advertisement_id") REFERENCES "advertisements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisements" ADD CONSTRAINT "FK_3eb21970c66bdf38d5b7d9b5a68" FOREIGN KEY ("brand_Id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisements" ADD CONSTRAINT "FK_d5b0cdfb3abf62b7c0676b8cc9f" FOREIGN KEY ("model_Id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisements" ADD CONSTRAINT "FK_1ec6e7581e7aecc1ddcaeec13a5" FOREIGN KEY ("region_Id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisements" ADD CONSTRAINT "FK_6277b5b1c6ac26154f49ba2ef7c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0"`);
        await queryRunner.query(`ALTER TABLE "advertisements" DROP CONSTRAINT "FK_6277b5b1c6ac26154f49ba2ef7c"`);
        await queryRunner.query(`ALTER TABLE "advertisements" DROP CONSTRAINT "FK_1ec6e7581e7aecc1ddcaeec13a5"`);
        await queryRunner.query(`ALTER TABLE "advertisements" DROP CONSTRAINT "FK_d5b0cdfb3abf62b7c0676b8cc9f"`);
        await queryRunner.query(`ALTER TABLE "advertisements" DROP CONSTRAINT "FK_3eb21970c66bdf38d5b7d9b5a68"`);
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_e1bfabe4399da1bce5c97c918ae"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_f3c154ad4ddaccab7f3cbe92d44"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "advertisements"`);
        await queryRunner.query(`DROP TYPE "public"."advertisements_isvalidate_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advertisements_currency_enum"`);
        await queryRunner.query(`DROP TABLE "views"`);
        await queryRunner.query(`DROP TABLE "refresh-tokens"`);
        await queryRunner.query(`DROP TABLE "regions"`);
        await queryRunner.query(`DROP TYPE "public"."regions_region_enum"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "currency"`);
        await queryRunner.query(`DROP TYPE "public"."currency_currency_enum"`);
    }

}
