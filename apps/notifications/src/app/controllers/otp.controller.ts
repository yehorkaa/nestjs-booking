import { BadRequestException, Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { OtpRequestCreatedDto } from '../dto';
import { OtpService } from '../services/otp.service';
import { NOTIFICATIONS_TOPICS } from '@nestjs-booking-clone/common';
import { DataSource } from 'typeorm';
import { Inbox } from '../modules/inbox/entities/inbox.entity';
import { INBOX_STATUS } from '../modules/inbox/entities/inbox.const';

@Controller()
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly dataSource: DataSource
  ) {}

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED)
  async handleOtpRequestCreated(
    @Payload() data: OtpRequestCreatedDto,
    @Ctx() context: KafkaContext
  ) {
    return this.dataSource.transaction(async (manager) => {
      if (!data.messageId) {
        throw new BadRequestException('Message ID is required');
      }
      const inboxRepository = manager.getRepository(Inbox);
      const existingMessage = await inboxRepository.findOne({
        where: { messageId: data.messageId },
      });
      if (existingMessage) {
        const topic = context.getTopic();
        Logger.warn(`Duplicate found in topic: ${topic}`);
        return;
      }
      const inboxMessage = await inboxRepository.save({
        messageId: data.messageId,
        pattern: NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED,
        status: INBOX_STATUS.PENDING,
        payload: data,
      });

      const response = await this.otpService.handleOtpRequestCreated(data);
      await inboxRepository.update(
        { id: inboxMessage.id },
        { status: INBOX_STATUS.PROCESSED }
      );
      return response;
    });
  }

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_RETRY)
  async handleOtpRequestCreatedRetry(@Payload() data: OtpRequestCreatedDto) {
    return this.otpService.handleOtpRequestCreatedRetry(data);
  }

  @EventPattern(NOTIFICATIONS_TOPICS.OTP.REQUEST_CREATED_DLT)
  async handleOtpRequestCreatedDlt(@Payload() data: OtpRequestCreatedDto) {
    return this.otpService.handleOtpRequestCreatedDlt(data);
  }
}
