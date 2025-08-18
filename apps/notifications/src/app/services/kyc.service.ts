import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { KycRequestDto } from '../dto';

@Injectable()
export class KycService {
  private readonly ADMIN_EMAIL = 'esipenkoegor2603@gmail.com'; // TODO: add to env

  constructor(private readonly mailerService: MailerService) {}

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
