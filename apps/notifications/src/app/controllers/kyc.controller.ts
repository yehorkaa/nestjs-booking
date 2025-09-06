import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KycRequestDto } from '../dto';
import { KycService } from '../services/kyc.service';
import { NOTIFICATIONS_TOPICS } from '@nestjs-booking-clone/common';

@Controller()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @EventPattern(NOTIFICATIONS_TOPICS.KYC.REQUEST_CREATED)
  async handleKycRequestCreated(@Payload() data: KycRequestDto) {
    return this.kycService.handleKycRequestCreated(data);
  }
}
