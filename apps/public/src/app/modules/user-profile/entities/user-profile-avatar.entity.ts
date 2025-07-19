import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from '../../common/entities/image.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class UserProfileAvatar extends Image {
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.avatars, {
    onDelete: 'CASCADE',
  })
  userProfile: UserProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isMain: boolean;
}
