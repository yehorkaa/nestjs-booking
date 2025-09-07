import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpController } from './controllers/otp.controller';
import { KycController } from './controllers/kyc.controller';
import { OtpService } from './services/otp.service';
import { KycService } from './services/kyc.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import kafkaConfig from './config/kafka.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import mailerConfig from './config/mailer.config';
import { join } from 'path';
import { MessagingModule } from './modules/messaging/messaging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from './config/postgres.config';
import { InboxModule } from './modules/inbox/inbox.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/notifications/.env'],
      isGlobal: true,
      load: [kafkaConfig, mailerConfig, postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (postgresConfiguration: ConfigType<typeof postgresConfig>) => {
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
    InboxModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (mailerConfiguration: ConfigType<typeof mailerConfig>) => {
        console.log('mailerConfiguration 🔧', mailerConfiguration);
        return {
          transport: {
            host: mailerConfiguration.host,
            port: mailerConfiguration.port,
            secure: false,
            auth: {
              user: mailerConfiguration.auth.user,
              pass: mailerConfiguration.auth.pass,
            },
          },
          defaults: {
            from: `"No Reply" nestjs-booking-clone@gmail.com`,
          },
          preview: false,
          template: {
            dir: join(__dirname, 'mail-templates'),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [mailerConfig.KEY],
    }),
  ],
  controllers: [AppController, OtpController, KycController],
  providers: [AppService, OtpService, KycService],
})
export class AppModule {}
