import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { OtpRequestCreatedDto, KycRequestDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('notifications.otp.request.created')
  async handleOtpRequestCreated(data: OtpRequestCreatedDto) {
    return this.appService.handleOtpRequestCreated(data);
  }

  @EventPattern('notifications.otp.request.created.retry')
  async handleOtpRequestCreatedRetry(data: OtpRequestCreatedDto) {
    return this.appService.handleOtpRequestCreatedRetry(data);
  }

  @EventPattern('notifications.otp.request.created.dlt')
  async handleOtpRequestCreatedDlt(data: OtpRequestCreatedDto) {
    return this.appService.handleOtpRequestCreatedDlt(data);
  }

  @EventPattern('notifications.kyc.request.created')
  async handleKycRequestCreated(data: KycRequestDto) {
    return this.appService.handleKycRequestCreated(data);
  }
}
