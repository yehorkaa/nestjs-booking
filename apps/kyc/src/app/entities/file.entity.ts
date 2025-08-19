import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  url: string;
}
