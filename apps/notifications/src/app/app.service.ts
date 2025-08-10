import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpRequestDto, KycRequestDto } from './dto';

@Injectable()
export class AppService {
  private readonly ADMIN_EMAIL = 'esipenkoegor2603@gmail.com'; // TODO: add to env

  constructor(private readonly mailerService: MailerService) {}

  getData(): { message: string } {
    return { message: 'Hello FROM NOTIFICATIONS SERVICE' };
  }

  async handleOtpRequestCreated(data: OtpRequestDto) {
    try {
      if (!data || !data.email || !data.otp) {
        throw new Error('Invalid OTP data');
      }
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
      Logger.error(
        `Failed to send OTP with such data: ${
          data ? JSON.stringify(data) : data
        }`,
        e.stack
      );
      throw new InternalServerErrorException(
        'Failed to send OTP email',
        e.message
      );
    }
  }

  async handleKycRequestCreated(data: KycRequestDto) {
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
        `Failed to send email to user ${data.email}`,
        userEmail.reason
      );
    }
    if (adminEmail.status === 'rejected') {
      Logger.error(
        `Failed to send email to admin ${this.ADMIN_EMAIL}`,
        adminEmail.reason
      );
    }
  }
}
