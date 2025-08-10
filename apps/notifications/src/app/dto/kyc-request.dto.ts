import { KycRequestStatus } from '@nestjs-booking-clone/common';

export class KycRequestDto {
  // @IsEmail() TODO: Figure out wether we need to validate and use send instead of emit
  email: string;

  // @IsEnum(KYC_REQUEST_STATUS)
  status: KycRequestStatus;
}
