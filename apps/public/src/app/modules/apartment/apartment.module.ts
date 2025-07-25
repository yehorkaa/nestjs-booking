import { Module } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './entities/apartment.entity';
import { ApartmentAddress } from './entities/apartment-address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentPrice } from './entities/apartment-price.entity';
import { ApartmentReservation } from './entities/apartment-reservation.entity';
import { ApartmentFavorite } from './entities/apartment-favorite.entity';
import { ApartmentImage } from './entities/apartment-image.entity';
import { ApartmentTag } from './entities/apartment-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      ApartmentAddress,
      ApartmentPrice,
      ApartmentReservation,
      ApartmentFavorite,
      ApartmentImage,
      ApartmentTag,
    ]),
  ],
  controllers: [ApartmentController],
  providers: [ApartmentService],
})
export class ApartmentModule {}
