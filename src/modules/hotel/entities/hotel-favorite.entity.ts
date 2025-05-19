import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hotel } from "./hotel.entity";

@Entity()
export class HotelFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.hotelFavorites)
  user: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.favorites)
  @JoinColumn()
  hotel: Hotel;

  @Column({ default: false })
  isFavorite: boolean;
} 