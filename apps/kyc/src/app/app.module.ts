import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigType } from '@nestjs/config';
import kafkaConfig from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/kyc/.env'],
      isGlobal: true,
      load: [kafkaConfig],
    }),
    ClientsModule.registerAsync([
      {
        name: 'KYC_SERVICE',
        imports: [ConfigModule],
        useFactory: (kafkaConfiguration: ConfigType<typeof kafkaConfig>) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfiguration.clientId,
                brokers: [kafkaConfiguration.brokerUrl],
              },
            },
          };
        },
        inject: [kafkaConfig.KEY],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
