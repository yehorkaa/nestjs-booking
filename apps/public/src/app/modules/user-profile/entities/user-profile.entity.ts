import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GENDER, Gender } from '@nestjs-booking-clone/common';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' }) // onDelete: 'CASCADE' is used to delete the profile when the user's foreign key is deleted
  @JoinColumn() // user_id is created here because of the @JoinColumn() annotation
  user: User;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: GENDER, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true})
  avatar: string;
}
