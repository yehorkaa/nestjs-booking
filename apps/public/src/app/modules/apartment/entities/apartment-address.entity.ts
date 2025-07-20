import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Apartment } from './apartment.entity';

@Entity()
export class ApartmentAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  buildingDetails?: string; 

  @OneToOne(() => Apartment, (apartment) => apartment.address, { onDelete: 'CASCADE' })
  apartment: Apartment;
}