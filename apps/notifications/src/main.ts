/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import kafkaConfig from './app/config/kafka.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const kafkaConfiguration = kafkaConfig();
  console.log('kafkaConfiguration 🔧', kafkaConfiguration);
  // use createMicroservice() instead of create() since notification service won't use HTTP
  // so we make light-weight application that will work faster than with create()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen();
}

bootstrap();
