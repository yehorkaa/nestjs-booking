import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApartmentModule } from './modules/apartment/apartment.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './modules/common/common.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UploadModule } from './modules/upload/upload.module';
import { AwsModule } from './modules/aws/aws.module';
import redisCacheConfig from './config/cache.config';
import postgresConfig from './config/postgres.config';
import mailerConfig from './config/mailer.config';

// Plan:
// 1. finish work with upload module -- DONE
// 2. finish work with aws module -- DONE
// 3. add CRUD for user profile -- DONE
// 4. create microservoces for kyc, notifications and integrate it with app
// 5. check auth for property owner
// 6. create CRUD for apartment
// 7. create CRUD for apartment reservations
// 8. create CRUD for apartment favorites
// 9. create CRUD for hotel
// 10. create CRUD for hotel reservations

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/public/.env'],
      isGlobal: true,
      load: [redisCacheConfig, postgresConfig, mailerConfig],
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
          synchronize: true,
        };
      },
      inject: [postgresConfig.KEY],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cacheConfiguration: ConfigType<typeof redisCacheConfig>) => {
        console.log('cacheConfiguration 🔧', cacheConfiguration);
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: cacheConfiguration.ttl }),
            }),
            createKeyv(cacheConfiguration.redisUrl),
          ],
        };
      },
      inject: [redisCacheConfig.KEY],
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
            dir: __dirname + '/app/templates',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [mailerConfig.KEY],
    }),
    CommonModule,
    UserModule,
    UserProfileModule,
    AuthModule,
    ApartmentModule,
    HotelModule,
    UploadModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
