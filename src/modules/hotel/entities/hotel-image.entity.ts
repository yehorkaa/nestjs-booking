import { Entity, ManyToOne } from 'typeorm';
import { Image } from 'src/modules/common/entities/image.entity';
import { Hotel } from './hotel.entity';
import { HotelRoom } from './hotel-room.entity';

@Entity()
export class HotelImage extends Image {
    @ManyToOne(() => Hotel, (hotel) => hotel.images)
    hotel: Hotel;
}

@Entity()
export class HotelRoomImage extends Image {
    @ManyToOne(() => HotelRoom, (hotelRoom) => hotelRoom.images)
    hotelRoom: HotelRoom;
}