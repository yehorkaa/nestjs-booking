import { User } from '../../../modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HotelRoom } from './hotel-room.entity';

@Entity()
export class HotelReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => HotelRoom, (hotelRoom) => hotelRoom.reservations)
  @JoinTable()
  rooms: HotelRoom[];

  @ManyToOne(() => User, (user) => user.hotelReservations)
  user: User;

  @Column('timestamp')
  checkIn: Date;

  @Column('timestamp')
  checkOut: Date;

  @Column({ enum: ['confirmed', 'cancelled', 'default'], default: 'default' })
  status: 'confirmed' | 'cancelled' | 'default';

  @Column({ default: 0 })
  totalPrice: number;
}