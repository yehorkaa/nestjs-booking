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
import { ApartmentImage } from './apartment-image.entity';
import { ApartmentTag } from './apartment-tag.entity';

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

  @OneToMany(() => ApartmentImage, (apartmentImage) => apartmentImage.apartment, { cascade: true })
  @JoinColumn()
  images: ApartmentImage[];

  @OneToMany(() => ApartmentTag, (apartmentTag) => apartmentTag.apartments, { cascade: true })
  @JoinColumn()
  tags: ApartmentTag[];
}
