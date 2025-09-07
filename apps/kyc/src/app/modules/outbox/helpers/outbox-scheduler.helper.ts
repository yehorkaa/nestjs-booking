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
      order: { createdAt: 'ASC' },
      take: 100,
    });

    if (events.length === 0) {
      return;
    }

    await this.outboxQueue.add(
      BULL_QUEUE_PROCESSES.PROCESS_EVENTS,
      { eventIds: events.map((event) => event.id) },
      { attempts: 3, backoff: 5000 }
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async enqueueOutboxEventsCleaner() {
    const events = await this.outboxRepository.find({
      where: { status: OUTBOX_STATUSES.SENT },
      order: { createdAt: 'ASC' },
      take: 100,
    });

    if (events.length === 0) {
      return;
    }

    await this.outboxQueue.add(
      BULL_QUEUE_PROCESSES.CLEAN_SENT_EVENTS,
      { eventIds: events.map((event) => event.id) },
      { attempts: 3, backoff: 5000 }
    );
  }
}
