import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxEvent } from '../entities/outbox.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OUTBOX_STATUSES } from '@nestjs-booking-clone/common';
import { BULL_QUEUE_PROCESSES, BULL_QUEUES } from '../../../const/bull.const';

@Injectable()
export class OutboxScheduler {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
    @InjectQueue(BULL_QUEUES.OUTBOX_EVENT) private readonly outboxQueue: Queue
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async enqueueOutboxEvents() {
    const events = await this.outboxRepository.find({
      where: { status: OUTBOX_STATUSES.PENDING },
      take: 100,
    });

    for (const event of events) {
      await this.outboxQueue.add(
        BULL_QUEUE_PROCESSES.PROCESS_EVENT,
        { eventId: event.id },
        { attempts: 5, backoff: 5000 }
      );
    }
  }
}
