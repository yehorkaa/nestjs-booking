import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Apartment } from "./apartment.entity";

// This approach allows us to create like a many to many relationship between user and apartment
// and additionaly add metadata to the table
@Entity()
export class ApartmentFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.apartmentFavorites)
  user: User;

  @ManyToOne(() => Apartment, (apartment) => apartment.favorites)
  @JoinColumn()
  apartment: Apartment;

  @Column({ default: false })
  isFavorite: boolean;
}