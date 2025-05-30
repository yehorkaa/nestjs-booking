import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;
}