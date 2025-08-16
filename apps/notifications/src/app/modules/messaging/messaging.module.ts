import { ClientsModule } from '@nestjs/microservices';
import { NotificationsClientProvider } from './providers/notifications.provider';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      // we need to register a few clients in case we want either to
      // 1) make more syntax sugar like inject notification service or kyc service ( we gonna have same configs but with diff names)
      // 2) we have different message brokers for different services (kafka, rabbitmq, etc)
      // 3) we have different clusters with different configs ( but quite rare in most projects )
      // 4) probably different security configs
      NotificationsClientProvider,
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {}
