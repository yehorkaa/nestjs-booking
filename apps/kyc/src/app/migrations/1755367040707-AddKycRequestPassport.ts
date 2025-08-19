import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKycRequestPassport1755367040707 implements MigrationInterface {
    name = 'AddKycRequestPassport1755367040707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "file_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "url" character varying NOT NULL,
                CONSTRAINT "PK_d8375e0b2592310864d2b4974b2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "kyc_request_passport" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "url" character varying NOT NULL,
                "kycRequestId" uuid,
                CONSTRAINT "PK_653be994a36f536ffd42fde0d50" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ADD "firstName" character varying(30)
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ADD "lastName" character varying(30)
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ADD "taxNumber" character varying(30)
        `);
        
        // Fill existing records with default values
        await queryRunner.query(`
            UPDATE "kyc_request" 
            SET "firstName" = 'Unknown', "lastName" = 'Unknown', "taxNumber" = '000000000'
            WHERE "firstName" IS NULL OR "lastName" IS NULL OR "taxNumber" IS NULL
        `);
        
        // Make columns NOT NULL after filling data
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ALTER COLUMN "firstName" SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ALTER COLUMN "lastName" SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request"
            ALTER COLUMN "taxNumber" SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request_passport"
            ADD CONSTRAINT "FK_85d2640552b7f2842d6b7098962" FOREIGN KEY ("kycRequestId") REFERENCES "kyc_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "kyc_request_passport" DROP CONSTRAINT "FK_85d2640552b7f2842d6b7098962"
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request" DROP COLUMN "taxNumber"
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "kyc_request" DROP COLUMN "firstName"
        `);
        await queryRunner.query(`
            DROP TABLE "kyc_request_passport"
        `);
        await queryRunner.query(`
            DROP TABLE "file_entity"
        `);
    }

}
