import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from './entities/outbox.entity';
import { OutboxScheduler } from './helpers/outbox-scheduler.helper';
import { OutboxWorker } from './helpers/outbox-worker.helper';
import { BULL_QUEUES } from '../../const/bull.const';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MessagingModule,
    BullModule.registerQueue({
      name: BULL_QUEUES.OUTBOX_EVENT,
    }),
    TypeOrmModule.forFeature([OutboxEvent]),
  ],
  providers: [OutboxScheduler, OutboxWorker],
  exports: [OutboxScheduler, OutboxWorker],
})
export class OutboxModule {}
