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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: ['local'], default: 'local' })
  provider: 'local';

  @Column({ enum: ['creator', 'tenant'], default: 'tenant' })
  role: 'creator' | 'tenant';

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
}
