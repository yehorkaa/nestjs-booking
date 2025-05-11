import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { ApartmentReservation } from './apartment-reservation.entity';
import { ApartmentFavorite } from './apartment-favorite.entity';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(
    () => ApartmentReservation,
    (apartmentReservation) => apartmentReservation.apartment,
  )
  reservations: ApartmentReservation[];

  @OneToMany(
    () => ApartmentFavorite,
    (apartmentFavorite) => apartmentFavorite.apartment,
  )
  favorites: ApartmentFavorite[];

  @ManyToOne(() => Address, (address) => address.apartment)
  @JoinColumn()
  address: Address;

  @Column('text', { array: true, default: [] })
  images: string[];
}
