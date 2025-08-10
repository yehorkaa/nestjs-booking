import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import kafkaConfig from './config/kafka.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import mailerConfig from './config/mailer.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/notifications/.env'],
      isGlobal: true,
      load: [kafkaConfig, mailerConfig],
    }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
