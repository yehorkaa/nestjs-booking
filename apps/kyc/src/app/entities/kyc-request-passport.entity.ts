import { FileEntity } from './file.entity';
import { KycRequest } from './kyc-request.entity';
import { ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class KycRequestPassport extends FileEntity {
  @ManyToOne(() => KycRequest, (kycRequest) => kycRequest.passport, {
    onDelete: 'CASCADE',
  })
  kycRequest: KycRequest;
}
