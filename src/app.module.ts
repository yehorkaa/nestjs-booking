import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApartmentModule } from './modules/apartment/apartment.module';
import { HotelModule } from './modules/hotel/hotel.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_NAME,
          autoLoadEntities: true,  
          synchronize: true,
        };
      },
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
export class AppModule {}
