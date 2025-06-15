import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  iconName: string;
}