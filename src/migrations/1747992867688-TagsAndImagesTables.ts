import { MigrationInterface, QueryRunner } from "typeorm";

export class TagsAndImagesTables1747992867688 implements MigrationInterface {
    name = 'TagsAndImagesTables1747992867688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "apartment_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "apartmentId" uuid, CONSTRAINT "PK_07c5fbd864d71b6b1ae9e57c8f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_8bd9c683e92bfbb917a4bb0ff88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_room_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "roomsId" uuid, CONSTRAINT "PK_a3b26d0263bf5470e3720294883" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "hotelId" uuid, CONSTRAINT "PK_9d5ff18f4d680a90b873fd7ed62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_room_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "hotelRoomId" uuid, CONSTRAINT "PK_6b0ff73b8be5a0bbe8ae2645df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "apartment" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "hotel_room" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "hotel_room" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "apartment_image" ADD CONSTRAINT "FK_acd3a2bda7aba6a1333fe4e5524" FOREIGN KEY ("apartmentId") REFERENCES "apartment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_room_tag" ADD CONSTRAINT "FK_8ce97d3b86ac17264a0122e0822" FOREIGN KEY ("roomsId") REFERENCES "hotel_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_image" ADD CONSTRAINT "FK_569d986e9d34248d795e427a33c" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_room_image" ADD CONSTRAINT "FK_c078b5ef1f1f441ef332ad14832" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_room_image" DROP CONSTRAINT "FK_c078b5ef1f1f441ef332ad14832"`);
        await queryRunner.query(`ALTER TABLE "hotel_image" DROP CONSTRAINT "FK_569d986e9d34248d795e427a33c"`);
        await queryRunner.query(`ALTER TABLE "hotel_room_tag" DROP CONSTRAINT "FK_8ce97d3b86ac17264a0122e0822"`);
        await queryRunner.query(`ALTER TABLE "apartment_image" DROP CONSTRAINT "FK_acd3a2bda7aba6a1333fe4e5524"`);
        await queryRunner.query(`ALTER TABLE "hotel_room" ADD "tags" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "hotel_room" ADD "images" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "tags" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "apartment" ADD "images" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`DROP TABLE "hotel_room_image"`);
        await queryRunner.query(`DROP TABLE "hotel_image"`);
        await queryRunner.query(`DROP TABLE "hotel_room_tag"`);
        await queryRunner.query(`DROP TABLE "hotel_tag"`);
        await queryRunner.query(`DROP TABLE "apartment_image"`);
    }

}
