import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Inbox } from './entities/inbox.entity';
import { TransactionHelper } from '../../helpers/transaction.helper';

@Injectable()
export class InboxService {
  constructor(private readonly transactionHelper: TransactionHelper) {}

  async processInboxMessages(
    process: (messages: Inbox[], manager: EntityManager) => Promise<unknown>, // we need to use aync callback since it allows us to normally create a transaction
    options: { take: number }
  ) {
    const queryRunner = await this.transactionHelper.start();
    try {
      const inboxRepository = queryRunner.manager.getRepository(Inbox);
      const messages = await inboxRepository.find({
        where: {
          status: 'pending',
        },
        order: {
          createdAt: 'ASC',
        },
        take: options.take,
      });
      await process(messages, queryRunner.manager);
    } catch (e) {
      Logger.error('Failed to process inbox messages', e);
      await queryRunner.rollbackTransaction();
      Logger.error('Rolled back transaction');
      throw e;
    } finally {
      await queryRunner.release();
      Logger.log('Released query runner');
    }
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
