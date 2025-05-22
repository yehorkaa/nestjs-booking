import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMigration1747918469412 implements MigrationInterface {
    name = 'UserMigration1747918469412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartment" DROP CONSTRAINT "FK_a3c2e39081335abf04606a75f07"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "password" TO "passwordHash"`);
        await queryRunner.query(`CREATE TABLE "apartment_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, "buildingDetails" character varying, CONSTRAINT "PK_6b04cd8c2b1d48567a9aaf82e62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apartment_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "apartmentId" uuid, CONSTRAINT "PK_c18d1d4f3e39ed2719115d0ac57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_room_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "roomId" uuid, CONSTRAINT "PK_5ed52ef1298871c434eec7b50aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isFavorite" boolean NOT NULL DEFAULT false, "userId" uuid, "hotelId" uuid, CONSTRAINT "PK_544b819c752b1ae9b6b7f639bda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tags" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_3a62ac86b369b36c1a297e9ab26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "images" text array NOT NULL DEFAULT '{}', "tags" text array NOT NULL DEFAULT '{}', "quantity" integer NOT NULL DEFAULT '0', "availableQuantity" integer NOT NULL DEFAULT '0', "hotelId" uuid, CONSTRAINT "UQ_c382db88fefd71c84aa7d4dc074" UNIQUE ("hotelId", "name"), CONSTRAINT "PK_d8592f10487e886e84bccf2f547" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'default', "totalPrice" integer NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "PK_9c05f6819cf4d48a9b9b5b49ad0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_reservation_rooms_hotel_room" ("hotelReservationId" uuid NOT NULL, "hotelRoomId" uuid NOT NULL, CONSTRAINT "PK_4f79998764bf09381e6411fb0fc" PRIMARY KEY ("hotelReservationId", "hotelRoomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c0a1fe47d3021c685dd4ed3a2" ON "hotel_reservation_rooms_hotel_room" ("hotelReservationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_18049c349771dd1f232a362461" ON "hotel_reservation_rooms_hotel_room" ("hotelRoomId") `);
        await queryRunner.query(`ALTER TABLE "apartment" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "apartment" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartment_reservation" ALTER COLUMN "status" SET DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'creator'`);
        await queryRunner.query(`ALTER TABLE "apartment_price" ADD CONSTRAINT "FK_a0ae5de96212b81a3fe2d337ae8" FOREIGN KEY ("apartmentId") REFERENCES "apartment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apartment" ADD CONSTRAINT "FK_a3c2e39081335abf04606a75f07" FOREIGN KEY ("addressId") REFERENCES "apartment_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_room_price" ADD CONSTRAINT "FK_f6ae2fb4aaa724b500d00702109" FOREIGN KEY ("roomId") REFERENCES "hotel_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_favorite" ADD CONSTRAINT "FK_6995f6ed2901f99f79cc89cb9e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_favorite" ADD CONSTRAINT "FK_c6604283488c8bc4cec600a8d07" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_room" ADD CONSTRAINT "FK_efce65de0a48aac5e18cc787525" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_reservation" ADD CONSTRAINT "FK_337ff0a4aeab437736e64fa92dc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_reservation_rooms_hotel_room" ADD CONSTRAINT "FK_2c0a1fe47d3021c685dd4ed3a21" FOREIGN KEY ("hotelReservationId") REFERENCES "hotel_reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hotel_reservation_rooms_hotel_room" ADD CONSTRAINT "FK_18049c349771dd1f232a3624616" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_reservation_rooms_hotel_room" DROP CONSTRAINT "FK_18049c349771dd1f232a3624616"`);
        await queryRunner.query(`ALTER TABLE "hotel_reservation_rooms_hotel_room" DROP CONSTRAINT "FK_2c0a1fe47d3021c685dd4ed3a21"`);
        await queryRunner.query(`ALTER TABLE "hotel_reservation" DROP CONSTRAINT "FK_337ff0a4aeab437736e64fa92dc"`);
        await queryRunner.query(`ALTER TABLE "hotel_room" DROP CONSTRAINT "FK_efce65de0a48aac5e18cc787525"`);
        await queryRunner.query(`ALTER TABLE "hotel_favorite" DROP CONSTRAINT "FK_c6604283488c8bc4cec600a8d07"`);
        await queryRunner.query(`ALTER TABLE "hotel_favorite" DROP CONSTRAINT "FK_6995f6ed2901f99f79cc89cb9e9"`);
        await queryRunner.query(`ALTER TABLE "hotel_room_price" DROP CONSTRAINT "FK_f6ae2fb4aaa724b500d00702109"`);
        await queryRunner.query(`ALTER TABLE "apartment" DROP CONSTRAINT "FK_a3c2e39081335abf04606a75f07"`);
        await queryRunner.query(`ALTER TABLE "apartment_price" DROP CONSTRAINT "FK_a0ae5de96212b81a3fe2d337ae8"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'tenant'`);
        await queryRunner.query(`ALTER TABLE "apartment_reservation" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "apartment" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartment" ADD "price" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18049c349771dd1f232a362461"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c0a1fe47d3021c685dd4ed3a2"`);
        await queryRunner.query(`DROP TABLE "hotel_reservation_rooms_hotel_room"`);
        await queryRunner.query(`DROP TABLE "hotel_reservation"`);
        await queryRunner.query(`DROP TABLE "hotel_room"`);
        await queryRunner.query(`DROP TABLE "hotel"`);
        await queryRunner.query(`DROP TABLE "hotel_favorite"`);
        await queryRunner.query(`DROP TABLE "hotel_room_price"`);
        await queryRunner.query(`DROP TABLE "apartment_price"`);
        await queryRunner.query(`DROP TABLE "apartment_address"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "passwordHash" TO "password"`);
        await queryRunner.query(`ALTER TABLE "apartment" ADD CONSTRAINT "FK_a3c2e39081335abf04606a75f07" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
