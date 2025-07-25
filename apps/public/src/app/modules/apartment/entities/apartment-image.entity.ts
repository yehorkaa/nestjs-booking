import { Image } from "../../common/entities/image.entity";
import { Entity, ManyToOne } from "typeorm";
import { Apartment } from "./apartment.entity";

@Entity()
export class ApartmentImage extends Image {
    @ManyToOne(() => Apartment, (apartment) => apartment.images, { onDelete: 'CASCADE' })
    apartment: Apartment;
}