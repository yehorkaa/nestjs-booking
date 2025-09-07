import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { Inbox } from './entities/inbox.entity';
import { TransactionHelper } from '../../helpers/transaction.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Inbox])],
  controllers: [InboxController],
  providers: [InboxService, TransactionHelper],
  exports: [TypeOrmModule, InboxService],
})
export class InboxModule {}
