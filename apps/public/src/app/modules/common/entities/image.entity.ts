import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column()
  url: string;
}