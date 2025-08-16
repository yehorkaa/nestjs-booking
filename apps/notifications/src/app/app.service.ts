import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpRequestCreatedDto, KycRequestDto } from './dto';
import { ClientKafka } from '@nestjs/microservices';
import { CLIENT_MODULES } from '@nestjs-booking-clone/common';

@Injectable()
export class AppService {
  private readonly ADMIN_EMAIL = 'esipenkoegor2603@gmail.com'; // TODO: add to env
  private readonly MAX_ATTEMPTS = 3;

  constructor(
    private readonly mailerService: MailerService,
    @Inject(CLIENT_MODULES.NOTIFICATION_SERVICE)
    private readonly notificationsClient: ClientKafka
  ) {}

  getData(): { message: string } {
    return { message: 'Hello FROM NOTIFICATIONS SERVICE' };
  }

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
      if (attempt < this.MAX_ATTEMPTS) {
        this.notificationsClient.emit(
          'notifications.otp.request.created.retry',
          {
            ...data,
            attempt: attempt + 1,
          }
        );
        return;
      }
      this.notificationsClient.emit('notifications.otp.request.created.dlt', {
        ...data,
        attempt: attempt + 1,
      });
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

  async handleKycRequestCreated(data: KycRequestDto) {
    // TODO: in case dmytro approves retry / dead letter logic add same here
    const [userEmail, adminEmail] = await Promise.allSettled([
      await this.mailerService.sendMail({
        to: data.email,
        subject:
          'Your request for getting property owner role is being processed',
        template: 'kyc-request-created-user',
        context: {
          email: data.email,
          status: data.status,
        },
      }),

      await this.mailerService.sendMail({
        to: this.ADMIN_EMAIL, // TODO: in future create custom admin for different users ( like in Freedom Finance )
        subject: 'New user request for getting property owner role',
        template: 'kyc-request-created-admin',
        context: {
          email: data.email,
          status: data.status,
        },
      }),
    ]);

    if (userEmail.status === 'rejected') {
      Logger.error(
        `handleKycRequestCreated: failed send user email \n data: ${JSON.stringify(
          data
        )}\n error: ${userEmail.reason}`,
        userEmail.reason
      );
    }
    if (adminEmail.status === 'rejected') {
      Logger.error(
        `handleKycRequestCreated: failed send admin email \n data: ${JSON.stringify(
          data
        )}\n error: ${adminEmail.reason}`,
        adminEmail.reason
      );
    }
  }
}
