import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelReservation } from './entities/hotel-reservation.entity';
import { HotelRoom } from './entities/hotel-room.entity';
import { HotelRoomPrice } from './entities/hotel-room-price.entity';
import { HotelFavorite } from './entities/hotel-favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hotel,
      HotelReservation,
      HotelRoom,
      HotelRoomPrice,
      HotelFavorite,
    ]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
