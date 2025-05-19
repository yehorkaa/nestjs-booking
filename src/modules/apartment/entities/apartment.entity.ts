import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApartmentAddress } from './apartment-address.entity';
import { ApartmentReservation } from './apartment-reservation.entity';
import { ApartmentFavorite } from './apartment-favorite.entity';
import { ApartmentPrice } from './apartment-price.entity';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => ApartmentPrice,
    (apartmentPrice) => apartmentPrice.apartment,
    { cascade: true },
  )
  @JoinColumn()
  prices: ApartmentPrice[];

  @OneToMany(
    () => ApartmentReservation,
    (apartmentReservation) => apartmentReservation.apartment,
    { cascade: true },
  )
  reservations: ApartmentReservation[];

  @OneToMany(
    () => ApartmentFavorite,
    (apartmentFavorite) => apartmentFavorite.apartment,
    { cascade: true },
  )
  favorites: ApartmentFavorite[];

  @ManyToOne(() => ApartmentAddress, (address) => address.apartment, {
    cascade: true,
  })
  @JoinColumn()
  address: ApartmentAddress;

  @Column('text', { array: true, default: [] })
  images: string[];
}
