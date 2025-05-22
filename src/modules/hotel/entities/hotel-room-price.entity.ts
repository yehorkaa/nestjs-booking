import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HotelRoom } from './hotel-room.entity';

@Entity()
export class HotelRoomPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column('date') 
  startDate: Date;

  @Column('date') 
  endDate: Date;

  @ManyToOne(() => HotelRoom, (hotelRoom) => hotelRoom.prices)
  room: HotelRoom;
}
