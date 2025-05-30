import { Entity, ManyToOne } from 'typeorm';
import { Tag } from '../../../modules/common/entities/tag.entity';
import { Hotel } from './hotel.entity';
import { HotelRoom } from './hotel-room.entity';

@Entity()
export class HotelTag extends Tag {
    @ManyToOne(() => Hotel, (hotel) => hotel.tags)
    hotels: Hotel[];
}

@Entity()
export class HotelRoomTag extends Tag {
    @ManyToOne(() => HotelRoom, (room) => room.tags)
    rooms: HotelRoom[]; 
}