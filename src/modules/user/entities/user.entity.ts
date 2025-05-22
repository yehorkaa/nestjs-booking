import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from '../../user-profile/entities/user-profile.entity';
import { ApartmentReservation } from 'src/modules/apartment/entities/apartment-reservation.entity';
import { ApartmentFavorite } from 'src/modules/apartment/entities/apartment-favorite.entity';
import { HotelReservation } from 'src/modules/hotel/entities/hotel-reservation.entity';
import { HotelFavorite } from 'src/modules/hotel/entities/hotel-favorite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ enum: ['local'], default: 'local' })
  provider: 'local';

  @Column({ enum: ['creator', 'propertyOwner'], default: 'creator' })
  role: 'creator' | 'propertyOwner';

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(
    () => ApartmentReservation,
    (apartmentReservation) => apartmentReservation.user,
    { cascade: true },
  )
  apartmentReservations: ApartmentReservation[];

  @OneToMany(
    () => ApartmentFavorite,
    (apartmentFavorite) => apartmentFavorite.user,
    { cascade: true },
  )
  apartmentFavorites: ApartmentFavorite[];

  @OneToMany(
    () => HotelReservation,
    (hotelReservation) => hotelReservation.user,
    { cascade: true },
  )
  hotelReservations: HotelReservation[];

  @OneToMany(
    () => HotelFavorite,
    (hotelFavorite) => hotelFavorite.user,
    { cascade: true },
  )
  hotelFavorites: HotelFavorite[];
}
