import { KycRequestStatus, KYC_REQUEST_STATUS } from '@nestjs-booking-clone/common';
import { IsEmail, IsEnum } from 'class-validator';

export class KycRequestDto {
  @IsEmail()
  email: string;

  @IsEnum(KYC_REQUEST_STATUS)
  status: KycRequestStatus;
}
