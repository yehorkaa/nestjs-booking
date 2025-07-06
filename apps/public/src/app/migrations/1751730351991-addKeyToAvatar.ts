import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeyToAvatar1751730351991 implements MigrationInterface {
    name = 'AddKeyToAvatar1751730351991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "apartment_image"
            ADD "key" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "hotel_image"
            ADD "key" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "hotel_room_image"
            ADD "key" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_avatar"
            ADD "key" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_profile_avatar" DROP COLUMN "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "hotel_room_image" DROP COLUMN "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "hotel_image" DROP COLUMN "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "apartment_image" DROP COLUMN "key"
        `);
    }

}
