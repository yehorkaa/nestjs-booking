import {
  PUBLIC_USER_ROLES,
  PublicUserRole,
} from '@nestjs-booking-clone/common';
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Column } from 'typeorm';
import { KycRequest } from './kyc-request.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: PUBLIC_USER_ROLES,
    array: true,
  })
  roles: PublicUserRole[];

  @OneToMany(() => KycRequest, (kycRequest) => kycRequest.user, {
    cascade: true,
  })
  kycRequests: KycRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
