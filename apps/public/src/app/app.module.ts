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
    UserModule,
    UserProfileModule,
    AuthModule,
    ApartmentModule,
    HotelModule,
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
    });
  }
}
