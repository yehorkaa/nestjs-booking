import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from '../../user-profile/entities/user-profile.entity';
import { ApartmentReservation } from '../../../modules/apartment/entities/apartment-reservation.entity';
import { ApartmentFavorite } from '../../../modules/apartment/entities/apartment-favorite.entity';
import { HotelReservation } from '../../../modules/hotel/entities/hotel-reservation.entity';
import { HotelFavorite } from '../../../modules/hotel/entities/hotel-favorite.entity';
import { PublicUserProvider, PublicUserRole } from '@nestjs-booking-clone/common';
import { PUBLIC_USER_PROVIDERS, PUBLIC_USER_ROLES } from '@nestjs-booking-clone/common';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: PUBLIC_USER_PROVIDERS, default: PUBLIC_USER_PROVIDERS.LOCAL })
  provider: PublicUserProvider;

  @Column({
    type: 'enum',
    enum: PUBLIC_USER_ROLES,
    array: true,
    default: [PUBLIC_USER_ROLES.TENANT],
  })
  roles: PublicUserRole[];

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true, // cascade allows us to save user with profile, but we can't do this in opposite direction, and also cascade should be used in one direction only
  })
  profile: UserProfile;

  @OneToMany(
    () => ApartmentReservation,
    (apartmentReservation) => apartmentReservation.user,
    { cascade: true }
  )
  apartmentReservations: ApartmentReservation[];

  @OneToMany(
    () => ApartmentFavorite,
    (apartmentFavorite) => apartmentFavorite.user,
    { cascade: true }
  )
  apartmentFavorites: ApartmentFavorite[];

  @OneToMany(
    () => HotelReservation,
    (hotelReservation) => hotelReservation.user,
    { cascade: true }
  )
  hotelReservations: HotelReservation[];

  @OneToMany(() => HotelFavorite, (hotelFavorite) => hotelFavorite.user, {
    cascade: true,
  })
  hotelFavorites: HotelFavorite[];

  // TODO: Add permissions, for example to allow admin to ban users, you can do this with table permissions or with token but better table
  // also need to add guard that is gonna check if user has permission to do something by sending sql query
  // permissions: UserPermission[]
  // UserPermission: { expiresAt: Date, assignedAt: Date, permission: Permission }
}
