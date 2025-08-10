import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import {
  KYC_REQUEST_STATUS,
  KycRequestStatus,
} from '@nestjs-booking-clone/common';
import { FileEntity } from './file.entity';

@Entity()
export class KycRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ length: 30 })
  taxNumber: string;

  @OneToOne(() => KycRequestPassport, (passport) => passport.kycRequest, {
    cascade: true,
  })
  passport: KycRequestPassport;

  @ManyToOne(() => User, (user) => user.kycRequests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: KYC_REQUEST_STATUS,
    default: KYC_REQUEST_STATUS.DEFAULT,
  })
  status: KycRequestStatus;

  @Column({ nullable: true, length: 1000 })
  adminComment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class KycRequestPassport extends FileEntity {
  @ManyToOne(() => KycRequest, (kycRequest) => kycRequest.passport, {
    onDelete: 'CASCADE',
  })
  kycRequest: KycRequest;
}
