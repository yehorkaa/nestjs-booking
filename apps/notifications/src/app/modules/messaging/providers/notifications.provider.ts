import { CLIENT_MODULES } from '@nestjs-booking-clone/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import kafkaConfig from '../../../config/kafka.config';

export const NotificationsClientProvider: ClientsProviderAsyncOptions = {
  name: CLIENT_MODULES.NOTIFICATION_SERVICE,
  imports: [ConfigModule],
  useFactory: (kafkaConfiguration: ConfigType<typeof kafkaConfig>) => {
    console.log('kafkaConfiguration 🔧', kafkaConfiguration);
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafkaConfiguration.clientId,
          brokers: [kafkaConfiguration.brokerUrl],
        },
        consumer: {
          groupId: kafkaConfiguration.groupId,
        },
      },
    };
  },
  inject: [kafkaConfig.KEY],
};
