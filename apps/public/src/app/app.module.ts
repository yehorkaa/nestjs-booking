import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
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

// Plan:
// 1. finish work with upload module
// 2. finish work with aws module
// 3. add CRUD for user profile
// 4. finish nestjs auth course ( look thoroughly at role module )
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
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000 }), // 60000ms = 1 minute
            }),
            createKeyv(process.env.REDIS_URL),
          ],
        };
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" nestjs-booking-clone@gmail.com`,
        },
        preview: false,
        template: {
          dir: __dirname +'/app/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
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
export class AppModule {
  constructor() {
    console.log('Database Configuration:', {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_NAME,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    });
  }
}
