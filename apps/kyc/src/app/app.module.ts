import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import kafkaConfig from './config/kafka.config';
import { CommonModule } from './modules/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from './config/postgres.config';
import { User } from './entities/user.entity';
import { KycRequest } from './entities/kyc-request.entity';
import { KycRequestPassport } from './entities/kyc-request-passport.entity';
import { FileEntity } from './entities/file.entity';
import { BullModule } from '@nestjs/bull';
import redisConfig from './config/redis.config';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagingModule } from './modules/messaging/messaging.module';
import { OutboxModule } from './modules/outbox/outbox.module';
import { TransactionHelper } from './helpers/transaction.helper';
import { OutboxEvent } from './modules/outbox/entities/outbox.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/kyc/.env'],
      isGlobal: true,
      load: [kafkaConfig, postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        postgresConfiguration: ConfigType<typeof postgresConfig>
      ) => {
        console.log('postgresConfiguration 🔧', postgresConfiguration);
        return {
          type: 'postgres',
          host: postgresConfiguration.host,
          port: postgresConfiguration.port,
          username: postgresConfiguration.username,
          password: postgresConfiguration.password,
          database: postgresConfiguration.database,
          autoLoadEntities: true,
          synchronize: postgresConfiguration.synchronize,
        };
      },
      inject: [postgresConfig.KEY],
    }),
    MessagingModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (redisConfiguration: ConfigType<typeof redisConfig>) => ({
        redis: {
          host: redisConfiguration.host,
          port: redisConfiguration.port,
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    OutboxModule,
    TypeOrmModule.forFeature([User, KycRequest, KycRequestPassport, FileEntity, OutboxEvent]), // refactor
  ],
  controllers: [AppController],
  providers: [AppService, TransactionHelper],
})
export class AppModule {}
