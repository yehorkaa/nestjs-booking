import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpRequestCreatedDto } from '../dto';
import { ClientKafka } from '@nestjs/microservices';
import {
  CLIENT_MODULES,
  NOTIFICATIONS_TOPICS,
} from '@nestjs-booking-clone/common';

@Injectable()
export class OtpService {
  private readonly MAX_FAIL_ATTEMPTS = 3;

  constructor(
    private readonly mailerService: MailerService,
    @Inject(CLIENT_MODULES.NOTIFICATION_SERVICE)
    private readonly notificationsClient: ClientKafka,
  ) {}

  async handleOtpRequestCreated(data: OtpRequestCreatedDto) {
    if (!data || !data.email || !data.otp) {
      throw new BadRequestException('Invalid OTP data');
    }

    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: data.subject,
        template: 'otp',
        context: {
          name: data.email,
          otp: data.otp,
        },
      });
    } catch (e) {
      const attempt = data?.attempt ?? 0;
      if (attempt < this.MAX_FAIL_ATTEMPTS) {
        // TODO: figure out about other methods of client kafka
        this.notificationsClient.emit(
          NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_RETRY,
          {
            ...data,
            attempt: attempt + 1,
          },
        );
        return;
      }
      this.notificationsClient.emit(
        NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_DLT,
        {
          ...data,
          attempt: attempt + 1,
        }
      );
    }
  }

  async handleOtpRequestCreatedRetry(data: OtpRequestCreatedDto) {
    const response = await this.handleOtpRequestCreated(data);
    Logger.log(
      `handleOtpRequestCreatedRetry: retry send email, attempt: ${
        data.attempt
      } \n data: ${JSON.stringify(data)}`
    );
    return response;
  }

  async handleOtpRequestCreatedDlt(data: OtpRequestCreatedDto) {
    Logger.error(
      `handleOtpRequestCreatedDlt: failed send email after ${
        data.attempt
      } attempts \n data: ${JSON.stringify(data)}`
    );
  }
}
