import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Inbox } from './entities/inbox.entity';
import { INBOX_STATUS } from './entities/inbox.const';

@Injectable()
export class InboxService {
  constructor(private readonly dataSource: DataSource) {}
  async processInboxMessages(
    process: (messages: Inbox[], manager: EntityManager) => Promise<unknown>, // we need to use aync callback since it allows us to normally create a transaction
    options: { take: number }
  ) {
    await this.dataSource.transaction(async (manager) => {
      const inboxRepository = manager.getRepository(Inbox);
      const messages = await inboxRepository.find({
        where: {
          status: INBOX_STATUS.PENDING,
        },
        order: {
          createdAt: 'ASC',
        },
        take: options.take,
      });
      await process(messages, manager);
    });
  }
  // TODO: as a code example below, as a future task: add queues with inbox pattern for reducing load for DB, read more in queues.js file
  //   @EventPattern('otp.request.created')
  //   async handleOtpRequestCreated(@Payload() data: any, @Ctx() ctx: KafkaContext) {
  //     const messageId = this.getMessageId(ctx);

  //     return await this.dataSource.transaction(async manager => {
  //       // Проверяем идемпотентность
  //       const existing = await manager.findOne(Inbox, { where: { messageId } });
  //       if (existing) return { status: 'already_processed' };

  //       // Сохраняем и сразу возвращаем ответ
  //       const inboxMessage = manager.create(Inbox, {
  //         messageId,
  //         pattern: 'otp.request.created',
  //         payload: data,
  //         status: 'pending'
  //       });
  //       await manager.save(inboxMessage);

  //       // Добавляем в очередь (неблокирующе)
  //       await this.otpQueue.add('send-otp', { inboxId: inboxMessage.id });

  //       return { status: 'queued' }; // ← Ответ за 1мс вместо 10 секунд
  //     });
  //   }

  //   @Processor('otp-queue')
  // async processOtp(job: Job) {
  //   const { inboxId } = job.data;

  //   try {
  //     const message = await this.inboxRepo.findOne({ where: { id: inboxId } });
  //     await this.otpService.sendOtp(message.payload);

  //     // Помечаем как обработанный
  //     await this.inboxRepo.update({ id: inboxId }, { status: 'processed' });

  //   } catch (error) {
  //     // BullMQ автоматически повторит 3 раза с экспоненциальной задержкой
  //     throw error;
  //   }
  // }
}
