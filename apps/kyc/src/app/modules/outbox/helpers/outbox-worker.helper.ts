import { Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxEvent } from '../entities/outbox.entity';
import { Repository } from 'typeorm';
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

  @Process(BULL_QUEUE_PROCESSES.PROCESS_EVENT)
  async handleOutboxJob(job: Job<{ eventId: string }>) {
    const event = await this.outboxRepository.findOneBy({
      id: job.data.eventId,
    });

    if (!event || event.status !== OUTBOX_STATUSES.PENDING) {
      return;
    }

    try {
      this.kycClient.emit(event.eventType, event.payload);
      await this.outboxRepository.update(event.id, { status: OUTBOX_STATUSES.SENT });
      Logger.log(`✅ Event ${event.id} sent to Kafka`);
    } catch (error) {
      Logger.error(`Failed to process event ${event.id}:`, error);
      throw error;
    }
  }
}
