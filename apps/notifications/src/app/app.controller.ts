import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { OtpRequestDto, KycRequestDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('otp.request.created')
  async handleOtpRequestCreated(data: OtpRequestDto) {
    return this.appService.handleOtpRequestCreated(data);
  }

  @EventPattern('kyc.request.created')
  async handleKycRequestCreated(data: KycRequestDto) {
    return this.appService.handleKycRequestCreated(data);
  }
}
