import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { HotelRoomPrice } from "./hotel-room-price.entity";
import { Hotel } from "./hotel.entity";
import { HotelReservation } from "./hotel-reservation.entity";
import { HotelRoomImage } from "./hotel-image.entity";
import { HotelRoomTag } from "./hotel-tag.entity";

@Entity()
@Unique(['hotel', 'name']) // Unique room name in the scope of different hotels
export class HotelRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => HotelRoomImage, (hotelRoomImage) => hotelRoomImage.hotelRoom, { cascade: true })
  @JoinColumn()
  images: HotelRoomImage[];

  @OneToMany(() => HotelRoomTag, (tag) => tag.rooms, { cascade: true })
  @JoinColumn()
  tags: HotelRoomTag[];

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  availableQuantity: number;

  @OneToMany(
    () => HotelRoomPrice,
    (hotelPrice) => hotelPrice.room,
    { cascade: true },
  )
  @JoinColumn()
  prices: HotelRoomPrice[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @ManyToMany(() => HotelReservation, (reservation) => reservation.rooms, { onDelete: 'CASCADE' })
  reservations: HotelReservation[];
}