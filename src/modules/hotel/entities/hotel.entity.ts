import { Column, JoinColumn, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { HotelRoom } from './hotel-room.entity';
import { HotelFavorite } from './hotel-favorite.entity';
import { HotelTag } from './hotel-tag.entity';
import { HotelImage } from './hotel-image.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => HotelImage, (hotelImage) => hotelImage.hotel, { cascade: true })
  @JoinColumn()
  images: HotelImage[];

  @OneToMany(() => HotelTag, (hotelTag) => hotelTag.hotels, { cascade: true })
  @JoinColumn()
  tags: HotelTag[];

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
