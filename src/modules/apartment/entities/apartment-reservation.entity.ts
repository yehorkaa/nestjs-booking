
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Apartment } from "./apartment.entity";

// This approach allows us to create like a many to many relationship between user and apartment
// and additionaly add metadata to the table
@Entity()
export class ApartmentReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.apartmentReservations)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Apartment, (apartment) => apartment.reservations)
  @JoinColumn()
  apartment: Apartment;

  @Column('timestamp')
  checkIn: Date;

  @Column('timestamp')
  checkOut: Date;

  @Column({ enum: ['confirmed', 'cancelled', 'default'], default: 'default' })
  status: 'confirmed' | 'cancelled' | 'default';
}