import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyToOneFixHotelTag1747993097159 implements MigrationInterface {
    name = 'ManyToOneFixHotelTag1747993097159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_tag" ADD "hotelsId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_tag" ADD CONSTRAINT "FK_6c375e8b1bd75ae27d8169d2b7b" FOREIGN KEY ("hotelsId") REFERENCES "hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_tag" DROP CONSTRAINT "FK_6c375e8b1bd75ae27d8169d2b7b"`);
        await queryRunner.query(`ALTER TABLE "hotel_tag" DROP COLUMN "hotelsId"`);
    }

}
