import { Column, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { HotelReservation } from './hotel-reservation.entity';
import { HotelRoom } from './hotel-room.entity';
import { HotelFavorite } from './hotel-favorite.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => HotelRoom, (hotelRoom) => hotelRoom.hotel, { cascade: true })
  @JoinColumn()
  rooms: HotelRoom[];

  @OneToMany(
    () => HotelFavorite,
    (hotelFavorite) => hotelFavorite.hotel,
    { cascade: true },
  )
  favorites: HotelFavorite[];
}
