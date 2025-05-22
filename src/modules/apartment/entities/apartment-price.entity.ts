
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Apartment } from "./apartment.entity";

@Entity()
export class ApartmentPrice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column('timestamp')
    startDate: Date;

    @Column('timestamp')
    endDate: Date;
    
   @ManyToOne(() => Apartment, (apartment) => apartment.prices)
   apartment: Apartment;
}