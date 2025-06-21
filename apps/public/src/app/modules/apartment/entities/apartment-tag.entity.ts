import { Apartment } from "./apartment.entity";
import { Entity, ManyToOne } from "typeorm";
import { Tag } from "../../common/entities/tag.entity";

@Entity()
export class ApartmentTag extends Tag {
    @ManyToOne(() => Apartment, (apartment) => apartment.tags)
    apartments: Apartment[];
}