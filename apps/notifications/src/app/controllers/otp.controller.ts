import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OtpRequestCreatedDto } from '../dto';
import { OtpService } from '../services/otp.service';
import { NOTIFICATIONS_TOPICS } from '@nestjs-booking-clone/common';

@Controller()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED)
  async handleOtpRequestCreated(data: OtpRequestCreatedDto) {
    return this.otpService.handleOtpRequestCreated(data);
  }

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_RETRY)
  async handleOtpRequestCreatedRetry(data: OtpRequestCreatedDto) {
    return this.otpService.handleOtpRequestCreatedRetry(data);
  }

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_DLT)
  async handleOtpRequestCreatedDlt(data: OtpRequestCreatedDto) {
    return this.otpService.handleOtpRequestCreatedDlt(data);
  }
}
