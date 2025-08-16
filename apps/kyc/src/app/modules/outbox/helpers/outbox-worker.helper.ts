import { Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxEvent } from '../entities/outbox.entity';
import { In, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { CLIENT_MODULES, OUTBOX_STATUSES } from '@nestjs-booking-clone/common';
import { BULL_QUEUE_PROCESSES, BULL_QUEUES } from '../../../const/bull.const';

@Processor(BULL_QUEUES.OUTBOX_EVENT)
export class OutboxWorker {
  constructor(
    @InjectRepository(OutboxEvent)
    private outboxRepository: Repository<OutboxEvent>,
    @Inject(CLIENT_MODULES.KYC_SERVICE) private kycClient: ClientKafka
  ) {}

  @Process(BULL_QUEUE_PROCESSES.PROCESS_EVENTS)
  async handleOutboxJob(job: Job<{ eventIds: string[] }>) {
    const events = await this.outboxRepository.findBy({
      id: In(job.data.eventIds),
      status: OUTBOX_STATUSES.PENDING,
    });

    if (events.length === 0) {
      return;
    }

    const processEventsQueue = events.map(async (event) => {
      this.kycClient.emit(event.eventType, event.payload);
      await this.outboxRepository.update(event.id, {
        status: OUTBOX_STATUSES.SENT,
      });
      Logger.log(`Kafka: Event ${event.id} sent to ${event.eventType}`);
    });

    try {
      await Promise.all(processEventsQueue);
    } catch (error) {
      Logger.error(`Failed to process events:`, error);
      throw error;
    }
  }
}
